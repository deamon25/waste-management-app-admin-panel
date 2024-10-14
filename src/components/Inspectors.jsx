import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../firebase';
import jsPDF from "jspdf";
import "jspdf-autotable";

const InspectorsTable = () => {
  const [data, setData] = useState([]); // State to store fetched data
  const [selectedInspector, setSelectedInspector] = useState(null); // State to store selected inspector for viewing
  const [showViewModal, setShowViewModal] = useState(false); // State to control view modal visibility
  const [showAddModal, setShowAddModal] = useState(false); // State to control add user modal visibility
  const [newInspector, setNewInspector] = useState({ // State for new inspector details
    name: '',
    email: '',
    district: '',
  });

  // Function to fetch documents from Firestore
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "inspectors"));
      const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(fetchedData); // Update state with fetched data
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  // Function to open the view modal and set the selected inspector
  const handleViewClick = (inspector) => {
    setSelectedInspector(inspector);
    setShowViewModal(true);
  };

  // Function to open the add user modal
  const handleAddUserClick = () => {
    setShowAddModal(true);
  };

  // Function to handle input change for new inspector
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInspector((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to save a new inspector to Firestore
  const handleSaveNewInspector = async () => {
    try {
      await addDoc(collection(db, "inspectors"), newInspector);
      fetchData(); // Refresh the table data after adding new user
      setShowAddModal(false); // Close the modal
      setNewInspector({ name: '', email: '', district: '' }); // Reset form
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Function to delete the selected inspector from Firestore
  const handleDeleteInspector = async () => {
    if (selectedInspector) {
      try {
        await deleteDoc(doc(db, "inspectors", selectedInspector.id));
        fetchData(); // Refresh the table data after deletion
        setShowViewModal(false); // Close the modal
        setSelectedInspector(null); // Reset selected inspector
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  };

  // Function to download the report as a PDF
  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Inspectors Report", 14, 22);
    doc.setFontSize(12);

    const tableColumn = ["Name", "Email", "District"];
    const tableRows = data.map(inspector => [
      inspector.name,
      inspector.email,
      inspector.district,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "grid",
    });

    doc.save("inspectors_report.pdf");
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []);

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddUserClick}
          className="inline-block rounded bg-green-600 px-4 py-2 text-xs font-medium text-white hover:bg-green-700 mx-2"
        >
          Add User
        </button>
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
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Email</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">District</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((inspector) => (
            <tr key={inspector.id}>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{inspector.name}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{inspector.email}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{inspector.district}</td>
              <td className="whitespace-nowrap px-4 py-2">
                <button
                  onClick={() => handleViewClick(inspector)}
                  className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Modal */}
      {showViewModal && selectedInspector && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <section className="rounded-3xl shadow-2xl bg-white max-w-md w-full mx-4 p-8 text-center">
            <div className="p-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
                Inspector Details
              </p>
              <h2 className="mt-4 text-2xl font-bold text-gray-800">Inspector Information</h2>
              <div className="mt-6 space-y-3 text-left">
                <p className="text-gray-600"><strong>Name:</strong> {selectedInspector.name}</p>
                <p className="text-gray-600"><strong>Email:</strong> {selectedInspector.email}</p>
                <p className="text-gray-600"><strong>District:</strong> {selectedInspector.district}</p>
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-1/2 mx-1 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-full font-bold"
                >
                  Close
                </button>
                <button
                  onClick={handleDeleteInspector}
                  className="w-1/2 mx-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <section className="rounded-3xl shadow-2xl bg-white max-w-md w-full mx-4 p-8 text-center">
            <div className="p-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-green-500">
                Add New Inspector
              </p>
              <h2 className="mt-4 text-2xl font-bold text-gray-800">New Inspector Information</h2>
              <div className="mt-6 space-y-3 text-left">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={newInspector.name}
                  onChange={handleInputChange}
                  className="w-full bg-transparent rounded-md border border-gray-300 py-2 px-3"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={newInspector.email}
                  onChange={handleInputChange}
                  className="w-full bg-transparent rounded-md border border-gray-300 py-2 px-3"
                />
                <input
                  type="text"
                  name="district"
                  placeholder="District"
                  value={newInspector.district}
                  onChange={handleInputChange}
                  className="w-full bg-transparent rounded-md border border-gray-300 py-2 px-3"
                />
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 mx-1 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-full font-bold"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveNewInspector}
                  className="w-1/2 mx-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold"
                >
                  Save
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default InspectorsTable;
