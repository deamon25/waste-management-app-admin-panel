import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../firebase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Function to fetch data from "users" collection
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const fetchedUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  // Function to open modal with selected user data
  const handleViewClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Function to download the report
  const downloadReport = () => {
    const doc = new jsPDF();
    const tableColumn = ["District", "Email", "Name"];
    const tableRows = [];

    // Loop through the users and format data for the table
    users.forEach(user => {
      const userData = [user.district, user.email, user.name];
      tableRows.push(userData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("User List Report", 14, 15);
    doc.save("user_list_report.pdf");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Users List</h1>
        <button
          onClick={downloadReport} // Call the download function on button click
          className="inline-block rounded bg-green-600 px-4 py-2 text-xs font-medium text-white hover:bg-green-700"
        >
          Download Report
        </button>
      </div>
      
      <div className="overflow-x-auto mt-8">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead>
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">District</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Email</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
              <th className="whitespace-nowrap px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{user.district}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{user.email}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{user.name}</td>
                <td className="whitespace-nowrap px-4 py-2">
                  <button
                    onClick={() => handleViewClick(user)}
                    className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <section className="rounded-3xl shadow-2xl bg-white max-w-md w-full mx-4 p-8 text-center">
            <div className="p-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
                User Details
              </p>
              <h2 className="mt-4 text-2xl font-bold text-gray-800">User Information</h2>
              
              <div className="mt-6 space-y-3 text-left">
                <p className="text-gray-600"><strong>District:</strong> {selectedUser.district}</p>
                <p className="text-gray-600"><strong>Email:</strong> {selectedUser.email}</p>
                <p className="text-gray-600"><strong>Name:</strong> {selectedUser.name}</p>
              </div>
              
              <div className="mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-full font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default UserList;
