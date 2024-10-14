import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../firebase';

const Table = () => {
  const [data, setData] = useState([]); // State to store fetched data

  // Function to fetch documents from Firestore
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "deamon"));
      const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(fetchedData); // Update state with fetched data
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
        <thead className="ltr:text-left rtl:text-right">
          <tr>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Email</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Password</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Role</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Salary</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {data.map((user) => (
            <tr key={user.id}>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{user.email}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{user.password}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">N/A</td> {/* Replace with actual role if available */}
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">N/A</td> {/* Replace with actual salary if available */}
              <td className="whitespace-nowrap px-4 py-2">
                <a
                  href="#"
                  className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
