import React, { FC, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { Client, Account } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("65e6a6f0780da76d3c7e");

const account = new Account(client);

const Navbar: FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const handleInitialCall = async () => {
      try {
        setIsLoading(true);
        const response = await account.get();
        setIsLoading(false);
        setIsLoggedIn(true);
        if (response !== null) {
          navigate("/expensepage");
        }
      } catch (error) {
        setIsLoading(false);
        setIsLoggedIn(false);
        console.log(error);
      }
    };

    handleInitialCall();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setIsLoggedIn(false);

      localStorage.removeItem("username");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <nav className="bg-black bg-opacity-60">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-2">
            <Link to="/" className="text-white text-xl mb-2 md:mb-0">
              Home
            </Link>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <button
                  className="text-pink-500 font-bold text-xs mt-1 px-4 py-2 border border-pink-500 rounded hover:bg-pink-500 hover:text-white transition"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-pink-500 font-bold text-xs mt-1 px-4 py-2 border border-pink-500 rounded hover:bg-pink-500 hover:text-white transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Navbar;

// import React, { FC, useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import LoadingSpinner from "./LoadingSpinner";
// import { Client, Account } from "appwrite";

// const client = new Client()
//   .setEndpoint("https://cloud.appwrite.io/v1")
//   .setProject("65e6a6f0780da76d3c7e");

// const account = new Account(client);

// const Navbar: FC = () => {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
//   const [username, setUsername] = useState<string | null>(null);

//   useEffect(() => {
//     const handleInitialCall = async () => {
//       try {
//         setIsLoading(true);
//         const response = await account.get();
//         setIsLoading(false);
//         setIsLoggedIn(true);
//         if (response) {
//           setUsername(response.name);
//           navigate("/expensepage");
//         }
//       } catch (error) {
//         setIsLoading(false);
//         setIsLoggedIn(false);
//         console.log(error);
//       }
//     };

//     handleInitialCall();
//   }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       await account.deleteSession("current");
//       setIsLoggedIn(false);
//       setUsername(null);
//       localStorage.removeItem("username");
//       navigate("/");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div>
//       {isLoading ? (
//         <LoadingSpinner />
//       ) : (
//         <nav className="bg-black bg-opacity-60">
//           <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-2">
//             <Link to="/" className="text-white text-xl mb-2 md:mb-0">
//               Home
//             </Link>
//             <div className="flex items-center space-x-4">
//               {isLoggedIn ? (
//                 <>
//                   <div className="text-white text-xl font-bold">
//                     {username ? username.charAt(0).toUpperCase() : ""}
//                   </div>
//                   <button
//                     className="text-pink-500 font-bold text-xs mt-1 px-4 py-2 border border-pink-500 rounded hover:bg-pink-500 hover:text-white transition"
//                     onClick={handleLogout}
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <Link
//                   to="/login"
//                   className="text-pink-500 font-bold text-xs mt-1 px-4 py-2 border border-pink-500 rounded hover:bg-pink-500 hover:text-white transition"
//                 >
//                   Login
//                 </Link>
//               )}
//             </div>
//           </div>
//         </nav>
//       )}
//     </div>
//   );
// };

// export default Navbar;
