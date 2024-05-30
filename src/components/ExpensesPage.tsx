import React, { useState, useEffect } from "react";
import { Client, Account, Databases, Query, ID } from "appwrite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import dateFormat from "dateformat";
import LoadingSpinner from "./LoadingSpinner";
import { GetListData } from "../Servises/data.service";
import Modal from "./Modal";

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
      const amountFloat = parseFloat(Amount);
      if (editingExpense) {
        setIsEditing(true);
        await database.updateDocument(
          "65e898740ae397f893d4",
          "65e8989e96592ba6b344",
          editingExpense.$id,
          {
            Amount: amountFloat,
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
            Amount: amountFloat,
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
    setdate(expense.date);
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
    <div className="container mx-auto p-4">
      <div className="text-center mt-3">
        <div className="mb-3">
          <label
            htmlFor="filter-date"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Filter by Date
          </label>
          <input
            type="date"
            id="filter-date"
            className="block w-48 mx-auto border border-gray-300 rounded p-2"
            value={date}
            onChange={(e) => setdate(e.target.value)}
          />
        </div>
      </div>

      <div>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="relative">
            <div className="max-w-3xl mx-auto mt-5">
              <div className="bg-white shadow-md rounded p-4">
                <button
                  className="absolute top-0 right-15 mt-3 mr-3 bg-blue-500 text-white font-bold py-1 px-2 rounded"
                  onClick={handleAddExpenseClick}
                >
                  Add
                </button>
                <h2 className="text-center mb-4 text-2xl font-semibold">
                  View Expenses
                </h2>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2">Amount</th>
                      <th className="border p-2">Date</th>
                      <th className="border p-2">Details</th>
                      <th className="border p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {expensesList.map((expense, index) => (
                      <tr key={index}>
                        <td className="border p-2">{expense.Amount}</td>
                        <td className="border p-2">{expense.date}</td>
                        <td className="border p-2">{expense.Details}</td>
                        <td className="border p-2">
                          <button
                            className="text-blue-500 mr-2"
                            onClick={() => handleEditExpense(expense)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className="text-red-500"
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
            <Modal isOpen={isModalOpen} onClose={handleCancel}>
              <div className="p-4">
                <h2 className="text-center mb-4 text-xl font-semibold">
                  {editingExpense ? "Edit" : "Add"} Expense
                </h2>
                {isAdding || isEditing ? (
                  <LoadingSpinner />
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Amount:
                      </label>
                      <input
                        type="number"
                        id="amount"
                        className="block w-full border border-gray-300 rounded p-2"
                        value={Amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Date:
                      </label>
                      <input
                        type="date"
                        id="date"
                        className="block w-full border border-gray-300 rounded p-2"
                        value={date}
                        onChange={(e) => setdate(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="details"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Details:
                      </label>
                      <input
                        type="text"
                        id="details"
                        className="block w-full border border-gray-300 rounded p-2"
                        value={Details}
                        onChange={(e) => setDetails(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded ${
                          isAdding || isEditing
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={isAdding || isEditing}
                      >
                        {editingExpense ? "Update" : "Add"}
                      </button>
                      <button
                        type="button"
                        className="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded"
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

      <div className="text-center mt-8">
        <h4 className="text-xl font-semibold">Total Expenses for {date}</h4>
        <p className="text-2xl font-bold">{totalAmount}</p>
      </div>
    </div>
  );
};

export default ExpensesPage;
