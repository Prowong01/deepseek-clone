'use client';
// import { useUser } from "@clerk/nextjs";
import { createContext, useContext } from "react";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
}

export const AppContextProvider = ({children}) => {
    // const { user } = useUser();

    const value = {
        user: '123'
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}