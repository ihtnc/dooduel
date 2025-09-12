"use client";

import { createContext, useContext } from "react";
import { User } from "@types";

const UserContext = createContext<User | null>(null);

export const UserContextProvider = ({
  children,
  user
}: {
  children: React.ReactNode,
  user: User | null
}) => {
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-hooks/rules-of-hooks
export const getUserContext = () => useContext(UserContext);