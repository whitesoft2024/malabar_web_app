// // UserContext.js
// import React, { useState, useEffect, createContext } from 'react';

// const UserContext = createContext();

// const UserProvider = ({ children }) => {
//  const [user, setUser] = useState(() => {
//     // Load user data from localStorage on initial render
//     const savedUser = localStorage.getItem('user');
//     return savedUser ? JSON.parse(savedUser) : null;
//  });

//  useEffect(() => {
//     // Save user data to localStorage whenever it changes
//     localStorage.setItem('user', JSON.stringify(user));
//  }, [user]);

//  return (
//     <UserContext.Provider value={{ user, setUser}}>
//       {children}
//     </UserContext.Provider>
//  );
// };
// export { UserContext, UserProvider };


// UserContext.js

import React, { useState, useEffect, createContext } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve the stored user data from localStorage during initialization
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    // Store the user data in localStorage whenever it changes
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

