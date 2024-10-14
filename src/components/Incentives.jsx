import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase';
import jsPDF from "jspdf";
import "jspdf-autotable";

// Fetch all incentives along with user data
const fetchAllIncentives = async () => {
  let allIncentives = [];

  try {
    // Step 1: Get all users
    const usersSnapshot = await getDocs(collection(db, "users"));

    // Step 2: Iterate over each user document
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();

      // Fetch incentives subcollection for the current user
      const incentivesSnapshot = await getDocs(collection(db, `users/${userId}/incentives`));

      // Step 3: Add each incentive to the list
      incentivesSnapshot.forEach((incentiveDoc) => {
        const incentiveData = incentiveDoc.data();
        incentiveData.userId = userId; // Optionally add user ID
        incentiveData.id = incentiveDoc.id; // Ensure the ID is stored
        incentiveData.userData = {
          district: userData.district,
          email: userData.email,
          image: userData.image,
          name: userData.name,
          uid: userData.uid,
        }; // Adding user data to incentives
        allIncentives.push(incentiveData);
      });
    }
  } catch (error) {
    console.error("Error fetching incentives:", error);
  }

  return allIncentives;
};

const IncentivesTable = () => {
  const [data, setData] = useState([]); // State to store fetched incentive data
  const [modalOpen, setModalOpen] = useState(false); // State to manage modal visibility
  const [selectedIncentive, setSelectedIncentive] = useState(null); // State to store selected incentive for modal
  const [isClarified, setIsClarified] = useState(false); // State to handle isClarified toggle

  // Function to load incentives when component mounts
  const loadIncentives = async () => {
    const incentives = await fetchAllIncentives();
    setData(incentives); // Update state with fetched incentives
  };

  useEffect(() => {
    loadIncentives(); // Fetch incentives when the component mounts
  }, []);

  const openModal = (incentive) => {
    setSelectedIncentive(incentive);
    setIsClarified(incentive.isClarified);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedIncentive(null);
  };

  // Handle toggle change and save to Firestore
  const handleIsClarifiedChange = (e) => {
    setIsClarified(e.target.checked);
  };

  const saveIsClarified = async () => {
    if (selectedIncentive) {
      try {
        const incentiveDocRef = doc(db, `users/${selectedIncentive.userId}/incentives`, selectedIncentive.id);
        await updateDoc(incentiveDocRef, { isClarified });

        // Update local state to reflect changes
        const updatedData = data.map((incentive) =>
          incentive.id === selectedIncentive.id ? { ...incentive, isClarified } : incentive
        );
        setData(updatedData);
        closeModal();
      } catch (error) {
        console.error("Error updating isClarified:", error);
      }
    }
  };


const downloadReport = () => {
    const doc = new jsPDF();

    // Define the columns for the table
    const columns = [
        { header: "User ID", dataKey: "userId" },
        { header: "Category", dataKey: "category" },
        { header: "Points", dataKey: "points" },
        { header: "Quantity", dataKey: "quantity" },
        { header: "Is Clarified", dataKey: "isClarified" },
        { header: "ID", dataKey: "id" },
    ];

    // Map data to rows
    const rows = data.map((incentive) => ({
        userId: incentive.userId || "N/A",
        category: incentive.category || "N/A",
        points: incentive.points || 0,
        quantity: incentive.quantity || 0,
        isClarified: incentive.isClarified ? "Yes" : "No",
        id: incentive.id || "N/A",
    }));

    // Add the table to the PDF
    doc.autoTable({
        head: [columns.map(col => col.header)],
        body: rows.map(row => columns.map(col => row[col.dataKey])),
    });

    // Save the PDF
    doc.save("incentives_report.pdf");
};

return (
    <div className="overflow-x-auto p-4">
        <div className="flex justify-between mb-4">
            <h1 className="text-xl font-bold">Incentives</h1>
            <button
                onClick={downloadReport}
                className="inline-block rounded bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
            >
                Download Report
            </button>
        </div>
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right">
                <tr>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">User ID</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Category</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Points</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Quantity</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Is Clarified</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">ID</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Actions</th>
                </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
                {data.map((incentive, index) => (
                    <tr key={index} className={incentive.isClarified ? "bg-green-100" : "bg-red-100"}>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{incentive.userId || 'N/A'}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{incentive.category || 'N/A'}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{incentive.points || 0}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{incentive.quantity || 0}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{incentive.isClarified ? 'Yes' : 'No'}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{incentive.id || 'N/A'}</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                            <button
                                onClick={() => openModal(incentive)}
                                className="rounded bg-green-600 px-4 py-1 text-xs font-medium text-white hover:bg-green-700"
                            >
                                View
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        {/* Modal for displaying incentive details */}
        {modalOpen && selectedIncentive && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6 w-96 shadow-lg transform transition-all duration-300">
                    <h2 className="text-lg font-bold mb-4">Incentive Details</h2>
                    <div className="mb-4">
                        <img src={selectedIncentive.userData.image} alt="User" className="w-16 h-16 rounded-full mb-2 mx-auto" />
                        <p className="text-center"><strong>Name:</strong> {selectedIncentive.userData.name}</p>
                        <p className="text-center"><strong>Email:</strong> {selectedIncentive.userData.email}</p>
                        <p className="text-center"><strong>District:</strong> {selectedIncentive.userData.district}</p>
                        <p className="text-center"><strong>UID:</strong> {selectedIncentive.userData.uid}</p>
                        <p className="text-center"><strong>Category:</strong> {selectedIncentive.category}</p>
                        <p className="text-center"><strong>Points:</strong> {selectedIncentive.points}</p>
                        <p className="text-center"><strong>Quantity:</strong> {selectedIncentive.quantity}</p>
                        <div className="mb-2 text-center">
                            <label className="block text-gray-700 font-medium">Is Clarified:</label>
                            <input
                                type="checkbox"
                                checked={isClarified}
                                onChange={handleIsClarifiedChange}
                                className="mt-1"
                            />
                        </div>
                        <p className="text-center"><strong>ID:</strong> {selectedIncentive.id}</p>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={saveIsClarified}
                            className="rounded bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 mr-2"
                        >
                            Save
                        </button>
                        <button
                            onClick={closeModal}
                            className="rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
);
};

export default IncentivesTable;
