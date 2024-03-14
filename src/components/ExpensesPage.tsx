import React, { useState, useEffect } from "react";
import { Client, Account, Databases, Query, ID } from "appwrite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import dateFormat from "dateformat";
import LoadingSpinner from "./LoadingSpinner";
import { GetListData } from "../Servises/data.service";

Modal.setAppElement("#root");

interface Expense {
  $id: string;
  Amount: number;
  date: string;
  Details: string;
}

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("65e6a6f0780da76d3c7e");

const database = new Databases(client);

const ExpensesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [expensesList, setExpensesList] = useState<Expense[]>([]);
  const [Amount, setAmount] = useState<string>("");
  const [date, setdate] = useState<string>(
    dateFormat(new Date(), "dd mm yyyy")
  );
  const [Details, setDetails] = useState<string>("");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

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
      const response = await GetListData(
        "65e898740ae397f893d4",
        "65e8989e96592ba6b344",
        [Query.equal("AppUserId", user.$id)]
      );
      // const response = await database.listDocuments(
      //   "65e898740ae397f893d4",
      //   "65e8989e96592ba6b344",
      //   [Query.equal("AppUserId", user.$id)]
      // );
      const formattedExpenses: Expense[] = response.documents.map(
        (expense: any) => ({
          ...expense,
          date: dateFormat(expense.date, "dd mm yyyy"),
        })
      );

      setExpensesList(formattedExpenses);
    } catch (error) {
      console.error("Error loading expenses:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsAdding(true);
      const user = await new Account(client).get();
      if (editingExpense) {
        setIsEditing(true);
        await database.updateDocument(
          "65e898740ae397f893d4",
          "65e8989e96592ba6b344",
          editingExpense.$id,
          {
            Amount,
            date,
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
            date,
            Details,
            AppUserId: user.$id,
          }
        );
      }
      setAmount("");
      setdate(dateFormat(new Date(), "dd mm yyyy"));
      setDetails("");
      loadExpenses();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setIsAdding(false);
      setIsEditing(false);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setAmount(expense.Amount.toString());
    setdate(formatDateForInput(expense.date));
    setDetails(expense.Details);
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;
    return year + "-" + month + "-" + day;
  };

  const handleDeleteExpense = async (expenseId: string) => {
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
    setdate(dateFormat(new Date(), "dd mm yyyy"));
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
                              <td>{expense.date}</td>
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
                                  onClick={async () => {
                                    if (
                                      window.confirm(
                                        "Are you sure you want to delete this expense?"
                                      )
                                    ) {
                                      setIsDeleting(true);
                                      try {
                                        await handleDeleteExpense(expense.$id);
                                      } catch (error) {
                                        console.error(
                                          "Error deleting expense:",
                                          error
                                        );
                                      } finally {
                                        setIsDeleting(false);
                                      }
                                    }
                                  }}
                                >
                                  {isDeleting ? (
                                    <LoadingSpinner />
                                  ) : (
                                    <FontAwesomeIcon icon={faTrash} />
                                  )}
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
                {isAdding || isEditing ? (
                  <LoadingSpinner />
                ) : (
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
                        value={date}
                        onChange={(e) => setdate(e.target.value)}
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
                      <button
                        type="submit"
                        className={`btn btn-primary w-100 position-relative ${
                          isAdding || isEditing ? "disabled" : ""
                        }`}
                        disabled={isAdding || isEditing}
                      >
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
                )}
              </div>
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;
