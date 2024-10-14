import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from '../../firebase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportsTable = () => {
    const [data, setData] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [isResolved, setIsResolved] = useState(false);

    // Function to fetch documents from Firestore
    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "requests"));
            const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(fetchedData);
        } catch (error) {
            console.error("Error fetching documents: ", error);
        }
    };

    // Function to handle the "View" button click
    const handleViewClick = (report) => {
        setSelectedReport(report);
        setIsResolved(report.isResolved); // Initialize the state for isResolved
        setShowViewModal(true);
    };

    // Function to handle the "Save" button click in the modal
    const handleSaveChange = async () => {
        if (selectedReport) {
            try {
                const reportRef = doc(db, "requests", selectedReport.id);
                await updateDoc(reportRef, { isResolved: isResolved });
                fetchData(); // Refresh the table data after updating
                handleCloseModal(); // Close the modal
            } catch (error) {
                console.error("Error updating document: ", error);
            }
        }
    };

    // Function to close the view modal
    const handleCloseModal = () => {
        setShowViewModal(false);
        setSelectedReport(null);
    };

    // Function to download the report
    const downloadReport = () => {
        const doc = new jsPDF();
        const tableColumn = ["Category", "Description", "Fee", "ID", "Is Resolved", "Request Date"];
        const tableRows = [];

        // Loop through the data and format it for the table
        data.forEach(request => {
            const requestData = [
                request.category,
                request.description,
                request.fee,
                request.id,
                request.isResolved ? "Yes" : "No",
                new Date(request.requestDate.seconds * 1000).toLocaleString()
            ];
            tableRows.push(requestData);
        });

        doc.autoTable(tableColumn, tableRows, { startY: 20 });
        doc.text("Reports List", 14, 15);
        doc.save("reports_list.pdf");
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                <button
                    onClick={downloadReport} // Call the download function on button click
                    className="inline-block rounded bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
                >
                    Download Report
                </button>
            </div>
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                <thead className="ltr:text-left rtl:text-right">
                    <tr>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Category</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Description</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Fee</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">ID</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Is Resolved</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Request Date</th>
                        <th className="px-4 py-2"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.map((request) => (
                        <tr key={request.id} className={request.isResolved ? "bg-green-100" : "bg-red-100"}>
                            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{request.category}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{request.description}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{request.fee}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{request.id}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{request.isResolved ? "Yes" : "No"}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{new Date(request.requestDate.seconds * 1000).toLocaleString()}</td>
                            <td className="whitespace-nowrap px-4 py-2">
                                <button
                                    onClick={() => handleViewClick(request)}
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
            {showViewModal && selectedReport && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <section className="rounded-3xl shadow-2xl bg-white max-w-md w-full mx-4 p-8 text-center">
                        <div className="p-4">
                            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
                                Report Details
                            </p>
                            <h2 className="mt-4 text-2xl font-bold text-gray-800">Report Information</h2>
                            
                            <div className="mt-6 space-y-3 text-left">
                                <p className="text-gray-600"><strong>Category:</strong> {selectedReport.category}</p>
                                <p className="text-gray-600"><strong>Description:</strong> {selectedReport.description}</p>
                                <p className="text-gray-600"><strong>Fee:</strong> {selectedReport.fee}</p>
                                <p className="text-gray-600"><strong>ID:</strong> {selectedReport.id}</p>
                                <p className="text-gray-600"><strong>Is Resolved:</strong></p>
                                <select
                                    value={isResolved}
                                    onChange={(e) => setIsResolved(e.target.value === "true")}
                                    className="w-full border rounded-md p-2"
                                >
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </select>
                                <p className="text-gray-600"><strong>Request Date:</strong> {new Date(selectedReport.requestDate.seconds * 1000).toLocaleString()}</p>
                            </div>
                            
                            <div className="mt-8 flex justify-between">
                                <button
                                    onClick={handleSaveChange}
                                    className="w-1/2 mx-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="w-1/2 mx-1 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-full font-bold"
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

export default ReportsTable;
