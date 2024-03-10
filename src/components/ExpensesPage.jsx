import React, { useState, useEffect } from "react";
import { Client, Account, Databases, Query, ID } from "appwrite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import dateFormat from "dateformat";
import LoadingSpinner from "./LoadingSpinner";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("65e6a6f0780da76d3c7e");

const database = new Databases(client);

const ExpensesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expensesList, setExpensesList] = useState([]);
  const [Amount, setAmount] = useState("");
  const [Date, setDate] = useState("");
  const [Details, setDetails] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const loadExpenses = async () => {
    try {
      const account = new Account(client);
      const user = await account.get();
      const response = await database.listDocuments(
        "65e898740ae397f893d4",
        "65e8989e96592ba6b344",
        [Query.equal("AppUserId", user.$id)]
      );
      const formattedExpenses = response.documents.map((expense) => ({
        ...expense,
        Date: dateFormat(expense.Date, "dd mmm yyyy"),
      }));

      setExpensesList(formattedExpenses);
    } catch (error) {
      console.error("Error loading expenses:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await new Account(client).get();
      if (editingExpense) {
        await database.updateDocument(
          "65e898740ae397f893d4",
          "65e8989e96592ba6b344",
          editingExpense.$id,
          {
            Amount,
            Date,
            Details,
            AppUserId: user.$id,
          }
        );
        setEditingExpense(null);
      } else {
        await database.createDocument(
          "65e898740ae397f893d4",
          "65e8989e96592ba6b344",
          ID.unique(),
          {
            Amount,
            Date,
            Details,
            AppUserId: user.$id,
          }
        );
      }
      setAmount("");
      setDate("");
      setDetails("");
      loadExpenses();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleEditExpense = (expense) => {
    setAmount(expense.Amount);
    setDate(expense.Date);
    setDetails(expense.Details);
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await database.deleteDocument(
        "65e898740ae397f893d4",
        "65e8989e96592ba6b344",
        expenseId
      );
      loadExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleAddExpenseClick = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setEditingExpense(null);
    setAmount("");
    setDate("");
    setDetails("");
    setIsModalOpen(false);
  };

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div>
            <div className="container position-relative">
              <div className="row justify-content-center mt-5">
                <div className="col-md-8">
                  <div className="card mb-4">
                    <div className="card-body">
                      <button
                        className="btn btn-primary position-absolute top-0 end-0 mt-3 me-3"
                        onClick={handleAddExpenseClick}
                      >
                        Add Expense
                      </button>
                      <h2 className="text-center mb-4">View Expenses</h2>
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Details</th>
                            <th>Edit - Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expensesList.map((expense, index) => (
                            <tr key={index}>
                              <td>{expense.Amount}</td>
                              <td>{expense.Date}</td>
                              <td>{expense.Details}</td>
                              <td>
                                <button
                                  className="btn btn-link"
                                  onClick={() => handleEditExpense(expense)}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                  className="btn btn-link"
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        "Are you sure you want to delete this expense?"
                                      )
                                    ) {
                                      handleDeleteExpense(expense.$id);
                                    }
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Modal
              isOpen={isModalOpen}
              onRequestClose={handleCancel}
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
                content: {
                  width: "400px",
                  inset: "unset",
                  marginTop: "10%",
                  marginLeft: "38%",
                },
              }}
            >
              <div className="card-body">
                <h2 className="text-center mb-8">
                  {editingExpense ? "Edit" : "Add"}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="amount" className="form-label">
                      Amount:
                    </label>
                    <input
                      type="number"
                      id="amount"
                      className="form-control"
                      value={Amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                      Date:
                    </label>
                    <input
                      type="date"
                      id="date"
                      className="form-control"
                      value={Date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="details" className="form-label">
                      Details:
                    </label>
                    <input
                      type="text"
                      id="details"
                      className="form-control"
                      value={Details}
                      onChange={(e) => setDetails(e.target.value)}
                    />
                  </div>
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary">
                      {editingExpense ? "Update" : "Add"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;
