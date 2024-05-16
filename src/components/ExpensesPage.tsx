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

// Define loadExpenses function with setExpensesList parameter
const loadExpenses = async (
  setExpensesList: React.Dispatch<React.SetStateAction<Expense[]>>,
  date: Date
) => {
  try {
    const account = new Account(client);
    const user = await account.get();
    const response = await GetListData(
      "65e898740ae397f893d4",
      "65e8989e96592ba6b344",
      [
        Query.equal("AppUserId", user.$id),
        Query.equal("date", new Date(date).toISOString().substring(0, 10)),
      ]
    );
    const formattedExpenses: Expense[] = response.documents.map(
      (expense: any) => ({
        ...expense,
        date: dateFormat(expense.date, "dd mm yyyy"),
      })
    );

    // Use the passed setExpensesList function to update state
    setExpensesList(formattedExpenses);
  } catch (error) {
    console.error("Error loading expenses:", error);
  }
};

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
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    loadExpenses(setExpensesList, new Date(date));
  }, [date]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const total = expensesList.reduce((acc, expense) => {
      return acc + expense.Amount;
    }, 0);
    setTotalAmount(total);
  }, [expensesList]);

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
            date: new Date(date).toISOString(),
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
            date: new Date(date).toISOString(),
            Details,
            AppUserId: user.$id,
          }
        );
      }
      setAmount("");
      setdate(dateFormat(new Date(), "dd mm yyyy"));
      setDetails("");
      loadExpenses(setExpensesList, new Date(date));
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
    setDetails(expense.Details);
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await database.deleteDocument(
        "65e898740ae397f893d4",
        "65e8989e96592ba6b344",
        expenseId
      );
      loadExpenses(setExpensesList, new Date(date));
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
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <div className="text-center mt-3">
            {/* Add date picker */}
            <div
              className="mb-3"
              style={{ width: "fit-content", margin: "0 auto" }}
            >
              <label htmlFor="filter-date" className="form-label">
                Filter by Date
              </label>
              <input
                type="date"
                id="filter-date"
                className="form-control"
                value={date}
                onChange={(e) => setdate(e.target.value)}
                style={{ width: "150px" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div>
              <div className="container position-relative">
                <div className="row justify-content-center mt-5">
                  <div className="col-md-8">
                    <div
                      className="card mb-4"
                      style={{ background: "#f8f9fa" }}
                    >
                      <div className="card-body">
                        <button
                          className="btn btn-primary position-absolute top-0 end-0 mt-3 me-3"
                          onClick={handleAddExpenseClick}
                          style={{
                            fontWeight: 500,
                            fontSize: "11px",
                            color: "black",
                          }}
                        >
                          Add Expense
                        </button>
                        <h2
                          className="text-center mb-4"
                          style={{
                            fontWeight: 500,
                            fontSize: "25px",
                            marginRight: "40px",
                          }}
                        >
                          View Expenses
                        </h2>
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
                                          await handleDeleteExpense(
                                            expense.$id
                                          );
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
                    width: "90%",
                    maxWidth: "400px",
                    inset: "unset",
                    marginLeft: "20px",
                    marginTop: "10vh",
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
          )}
        </div>
      </div>

      {/* Summary Section */}
      <div className="row mt-3">
        <div className="col text-center">
          <h4>Total Amount for {date}</h4>
          <p>{totalAmount}</p>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
