import React, { useEffect, useState } from "react";
import { collection, getDocs, setDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from '../../firebase';
import jsPDF from "jspdf";
import "jspdf-autotable";

const CollectorsTable = () => {
  const [data, setData] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCollector, setNewCollector] = useState({
    uid: '',
    name: '',
    email: '',
    phone: '',
    district: '',
  });

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "collectors"));
      const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  const handleViewClick = (collector) => {
    setSelectedCollector(collector);
    setShowViewModal(true);
  };

  const handleAddUserClick = () => setShowAddModal(true);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCollector(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSaveNewCollector = async () => {
    try {
      await setDoc(doc(db, "collectors", newCollector.uid), newCollector);
      resetNewCollectorForm();
      fetchData();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const resetNewCollectorForm = () => {
    setShowAddModal(false);
    setNewCollector({ uid: '', name: '', email: '', phone: '', district: '' });
  };

  const handleDeleteCollector = async () => {
    try {
      await deleteDoc(doc(db, "collectors", selectedCollector.id));
      fetchData();
      setShowViewModal(false);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  // Function to download report as PDF
  const downloadReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Collectors Report", 14, 22);
    doc.setFontSize(12);

    const tableColumn = ["UID", "Name", "Email", "Phone", "District"];
    const tableRows = data.map(collector => [
      collector.uid,
      collector.name,
      collector.email,
      collector.phone,
      collector.district,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "grid",
    });

    doc.save("collectors_report.pdf");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Collectors</h1>
        <div>
          <button onClick={handleAddUserClick} className="inline-block rounded bg-green-600 px-4 py-2 text-xs font-medium text-white hover:bg-green-700 mx-2">
            Add User
          </button>
          <button onClick={downloadReport} className="inline-block rounded bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700">
            Download Report
          </button>
        </div>
      </div>
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
        <thead className="ltr:text-left rtl:text-right">
          <tr>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">UID</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Email</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Phone</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">District</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((collector) => (
            <tr key={collector.id}>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{collector.uid}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{collector.name}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{collector.email}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{collector.phone}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{collector.district}</td>
              <td className="whitespace-nowrap px-4 py-2">
                <button onClick={() => handleViewClick(collector)} className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Modal */}
      {showViewModal && selectedCollector && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <section className="rounded-3xl shadow-2xl bg-white max-w-md w-full mx-4 p-8 text-center">
            <div className="p-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">Collector Details</p>
              <h2 className="mt-4 text-2xl font-bold text-gray-800">Collector Information</h2>
              <div className="mt-6 space-y-3 text-left">
                <p className="text-gray-600"><strong>UID:</strong> {selectedCollector.uid}</p>
                <p className="text-gray-600"><strong>Name:</strong> {selectedCollector.name}</p>
                <p className="text-gray-600"><strong>Email:</strong> {selectedCollector.email}</p>
                <p className="text-gray-600"><strong>Phone:</strong> {selectedCollector.phone}</p>
                <p className="text-gray-600"><strong>District:</strong> {selectedCollector.district}</p>
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={() => setShowViewModal(false)} className="w-1/3 mx-1 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-full font-bold">Close</button>
                <button onClick={handleDeleteCollector} className="w-1/3 mx-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold">Delete</button>
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
              <p className="text-sm font-semibold uppercase tracking-widest text-green-500">Add New Collector</p>
              <h2 className="mt-4 text-2xl font-bold text-gray-800">New Collector Information</h2>
              <div className="mt-6 space-y-3 text-left">
                <input type="text" name="uid" placeholder="UID" value={newCollector.uid} onChange={handleInputChange} className="w-full bg-transparent rounded-md border border-gray-300 py-2 px-3" />
                <input type="text" name="name" placeholder="Name" value={newCollector.name} onChange={handleInputChange} className="w-full bg-transparent rounded-md border border-gray-300 py-2 px-3" />
                <input type="email" name="email" placeholder="Email" value={newCollector.email} onChange={handleInputChange} className="w-full bg-transparent rounded-md border border-gray-300 py-2 px-3" />
                <input type="text" name="phone" placeholder="Phone" value={newCollector.phone} onChange={handleInputChange} className="w-full bg-transparent rounded-md border border-gray-300 py-2 px-3" />
                <input type="text" name="district" placeholder="District" value={newCollector.district} onChange={handleInputChange} className="w-full bg-transparent rounded-md border border-gray-300 py-2 px-3" />
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={handleSaveNewCollector} className="w-1/2 mx-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold">Save</button>
                <button onClick={() => setShowAddModal(false)} className="w-1/2 mx-1 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-full font-bold">Cancel</button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default CollectorsTable;
