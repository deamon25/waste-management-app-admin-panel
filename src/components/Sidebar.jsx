import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Users"); // State to track the active item

  const handleNavigation = (path, item) => {
    navigate(path); // Navigate to the specified path
    setActiveItem(item); // Set the active item
  };

  return (
    <div className="flex h-screen flex-col justify-between border-e bg-white">
      <div className="px-4 py-6">
        <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
          Logo
        </span>

        <ul className="mt-6 space-y-1">
          <li>
            <a
              onClick={() => handleNavigation("/users", "Users")}
              className={`block rounded-lg px-4 py-2 text-sm font-medium ${activeItem === "Users" ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
            >
              Users
            </a>
          </li>

          <li>
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary
                className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <span className="text-sm font-medium"> Teams </span>

                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </summary>

              <ul className="mt-2 space-y-1 px-4">
                <li>
                  <a
                    onClick={() => handleNavigation("/collectors", "Collectors")}
                    className={`block rounded-lg px-4 py-2 text-sm font-medium ${activeItem === "Collectors" ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                  >
                    Collectors
                  </a>
                </li>

                <li>
                  <a
                    onClick={() => handleNavigation("/inspectors", "Inspectors")}
                    className={`block rounded-lg px-4 py-2 text-sm font-medium ${activeItem === "Inspectors" ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                  >
                    Inspectors
                  </a>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <a
              onClick={() => handleNavigation("/incentives", "Incentives")}
              className={`block rounded-lg px-4 py-2 text-sm font-medium ${activeItem === "Incentives" ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
            >
              Incentives
            </a>
          </li>

          <li>
            <a
              onClick={() => handleNavigation("/pickups", "Pickups")}
              className={`block rounded-lg px-4 py-2 text-sm font-medium ${activeItem === "Pickups" ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
            >
              Pickups
            </a>
          </li>

          <li>
            <a
              onClick={() => handleNavigation("/feedbacks", "Feedback")}
              className={`block rounded-lg px-4 py-2 text-sm font-medium ${activeItem === "Feedback" ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
            >
              Feedback
            </a>
          </li>

          <li>
            <a
              onClick={() => handleNavigation("/reports", "Reports")}
              className={`block rounded-lg px-4 py-2 text-sm font-medium ${activeItem === "Reports" ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
            >
              Reports
            </a>
          </li>

          <li>
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary
                className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <span className="text-sm font-medium"> Account </span>

                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </summary>

              <ul className="mt-2 space-y-1 px-4">
                <li>
                  <a
                    onClick={() => handleNavigation("#", "Account Details")}
                    className={`block rounded-lg px-4 py-2 text-sm font-medium ${activeItem === "Account Details" ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                  >
                    Details
                  </a>
                </li>

                <li>
                  <a
                    onClick={() => handleNavigation("#", "Security")}
                    className={`block rounded-lg px-4 py-2 text-sm font-medium ${activeItem === "Security" ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                  >
                    Security
                  </a>
                </li>

                <li>
                  <form action="#">
                    <button
                      type="submit"
                      onClick={() => handleNavigation("#", "Logout")}
                      className={`w-full rounded-lg px-4 py-2 text-sm font-medium ${activeItem === "Logout" ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                    >
                      Logout
                    </button>
                  </form>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
