import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../firebase';
import { jsPDF } from "jspdf"; // Importing jsPDF
import "jspdf-autotable"; // Importing jsPDF autoTable

// Fetch all feedbacks along with user data
const fetchAllFeedbacks = async () => {
  let allFeedbacks = [];

  try {
    // Step 1: Get all users
    const usersSnapshot = await getDocs(collection(db, "users"));

    // Step 2: Iterate over each user document
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();

      // Fetch feedbacks subcollection for the current user
      const feedbacksSnapshot = await getDocs(collection(db, `users/${userId}/feedbacks`));

      // Step 3: Add each feedback to the list
      feedbacksSnapshot.forEach((feedbackDoc) => {
        const feedbackData = feedbackDoc.data();
        feedbackData.userId = userId; // Optionally add user ID
        feedbackData.userData = {
          district: userData.district,
          email: userData.email,
          image: userData.image,
          name: userData.name,
          uid: userData.uid,
        }; // Adding user data to feedback
        allFeedbacks.push(feedbackData);
      });
    }
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
  }

  return allFeedbacks;
};

const FeedbacksTable = () => {
  const [data, setData] = useState([]); // State to store fetched feedback data
  const [modalOpen, setModalOpen] = useState(false); // State to manage modal visibility
  const [selectedFeedback, setSelectedFeedback] = useState(null); // State to store selected feedback for modal

  // Function to load feedbacks when component mounts
  const loadFeedbacks = async () => {
    const feedbacks = await fetchAllFeedbacks();
    setData(feedbacks); // Update state with fetched feedbacks
  };

  useEffect(() => {
    loadFeedbacks(); // Fetch feedbacks when the component mounts
  }, []);

  const openModal = (feedback) => {
    setSelectedFeedback(feedback);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedFeedback(null);
  };

  // Function to generate and download PDF report
  const downloadReport = () => {
    const doc = new jsPDF();

    // Set the title
    doc.setFontSize(18);
    doc.text("Feedback Report", 14, 22);

    // Create table headers
    const headers = [
      ["User ID", "Category", "Comments", "Had Issues", "Issue Description", "Rating", "User Name", "User Email", "User District"]
    ];

    // Prepare data rows
    const rows = data.map(feedback => [
      feedback.userId || 'N/A',
      feedback.category || 'N/A',
      feedback.comments || 'No comments provided',
      feedback.hadIssues ? 'Yes' : 'No',
      feedback.issueDescription || 'N/A',
      feedback.rating || 'N/A',
      feedback.userData.name || 'N/A',
      feedback.userData.email || 'N/A',
      feedback.userData.district || 'N/A'
    ]);

    // Add the table to the PDF
    doc.autoTable({
      head: headers,
      body: rows,
      startY: 30,
      theme: 'striped',
      styles: { fontSize: 10 }
    });

    // Save the PDF
    doc.save("feedback_report.pdf");
  };

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Feedbacks</h1>
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
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Comments</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Had Issues</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Issue Description</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Rating</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">ID</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {data.map((feedback, index) => (
            <tr key={index} className={feedback.rating <= 2 ? "bg-red-100" : ""}>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{feedback.userId || 'N/A'}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{feedback.category || 'N/A'}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{feedback.comments || 'No comments provided'}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{feedback.hadIssues ? 'Yes' : 'No'}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{feedback.issueDescription || 'N/A'}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{feedback.rating || 'N/A'}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{feedback.id || 'N/A'}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                <button
                  onClick={() => openModal(feedback)}
                  className="rounded bg-green-600 px-4 py-1 text-xs font-medium text-white hover:bg-green-700"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for displaying feedback details */}
      {modalOpen && selectedFeedback && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Feedback Details</h2>
            <div className="mb-4">
              <img src={selectedFeedback.userData.image} alt="User" className="w-16 h-16 rounded-full mb-2" />
              <p><strong>Name:</strong> {selectedFeedback.userData.name}</p>
              <p><strong>Email:</strong> {selectedFeedback.userData.email}</p>
              <p><strong>District:</strong> {selectedFeedback.userData.district}</p>
              <p><strong>UID:</strong> {selectedFeedback.userData.uid}</p>
              <p><strong>Category:</strong> {selectedFeedback.category}</p>
              <p><strong>Comments:</strong> {selectedFeedback.comments}</p>
              <p><strong>Had Issues:</strong> {selectedFeedback.hadIssues ? 'Yes' : 'No'}</p>
              <p><strong>Issue Description:</strong> {selectedFeedback.issueDescription}</p>
              <p><strong>Rating:</strong> {selectedFeedback.rating}</p>
            </div>
            <button
              onClick={closeModal}
              className="rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbacksTable;
