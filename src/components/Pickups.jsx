import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PickupsTable = () => {
  const [data, setData] = useState([]); // State to store fetched data
  const [selectedPickup, setSelectedPickup] = useState(null); // State to store selected pickup for viewing
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [status, setStatus] = useState(""); // State to manage status change

  // Function to fetch documents from Firestore
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "pickups"));
      const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(fetchedData); // Update state with fetched data
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  // Function to update the status in Firestore
  const updateStatus = async () => {
    if (selectedPickup) {
      try {
        const pickupDoc = doc(db, "pickups", selectedPickup.id);
        await updateDoc(pickupDoc, { status });
        fetchData(); // Refresh data after update
        setShowModal(false); // Close modal after update
      } catch (error) {
        console.error("Error updating status: ", error);
      }
    }
  };

  // Function to open the modal and set the selected pickup
  const handleViewClick = (pickup) => {
    setSelectedPickup(pickup);
    setStatus(pickup.status); // Set initial status
    setShowModal(true);
  };

  // Function to download report as PDF
  const downloadReport = () => {
    const doc = new jsPDF();
    doc.text("Pick Up Requests Report", 14, 16); // Add title to the PDF

    // Prepare data for autoTable
    const tableData = data.map((pickup) => [
      pickup.enteredAddress,
      pickup.fee,
      new Date(pickup.selectedDate.seconds * 1000).toLocaleDateString(),
      pickup.selectedGarbageType,
      pickup.selectedGarbageSize,
      pickup.status,
    ]);

    // Add autoTable
    doc.autoTable({
      head: [['Address', 'Fee', 'Date', 'Garbage Type', 'Garbage Size', 'Status']],
      body: tableData,
      startY: 30, // Start the table below the title
    });

    // Save the PDF
    doc.save('pickups_report.pdf');
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []);

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Pick up Requests</h1>
        <button
          onClick={downloadReport}
          className="inline-block rounded bg-green-600 px-4 py-2 text-xs font-medium text-white hover:bg-green-700"
        >
          Download Report
        </button>
      </div>
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
        <thead className="ltr:text-left rtl:text-right">
          <tr>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Address</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Fee</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Date</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Garbage Type</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Garbage Size</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Status</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {data.map((pickup) => (
            <tr key={pickup.id}>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{pickup.enteredAddress}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{pickup.fee}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{new Date(pickup.selectedDate.seconds * 1000).toLocaleDateString()}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{pickup.selectedGarbageType}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{pickup.selectedGarbageSize}</td>
              <td className={`whitespace-nowrap px-4 py-2 font-bold ${pickup.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}`}>
                {pickup.status}
              </td>
              <td className="whitespace-nowrap px-4 py-2">
                <button
                  onClick={() => handleViewClick(pickup)}
                  className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && selectedPickup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <section className="rounded-3xl shadow-2xl bg-white max-w-md w-full mx-4 p-8 text-center">
            <div className="p-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
                Pickup Details
              </p>
              <h2 className="mt-4 text-2xl font-bold text-gray-800">Manage Pickup Status</h2>
              
              <div className="mt-6 space-y-3 text-left">
                <p className="text-gray-600"><strong>Address:</strong> {selectedPickup.enteredAddress}</p>
                <p className="text-gray-600"><strong>Fee:</strong> ${selectedPickup.fee}</p>
                <p className="text-gray-600"><strong>Date:</strong> {new Date(selectedPickup.selectedDate.seconds * 1000).toLocaleDateString()}</p>
                <p className="text-gray-600"><strong>Garbage Type:</strong> {selectedPickup.selectedGarbageType}</p>
                <p className="text-gray-600"><strong>Garbage Size:</strong> {selectedPickup.selectedGarbageSize}</p>
              </div>
              
              <div className="mt-4">
                <label htmlFor="status" className="block text-gray-700 font-semibold mb-2">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-3 rounded-full border border-gray-300 bg-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-1/2 mx-1 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-full font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={updateStatus}
                  className="w-1/2 mx-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default PickupsTable;
