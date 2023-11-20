"use client";
import dynamic from "next/dynamic";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
// import FloatingSpace from "."
const FloatingSpace = dynamic(() => import("."), { ssr: false });

export type Space = {
  sid: number;
  title?: string;
};

type SpaceInterface = {
  currentSpace?: Space;
  setCurrentSpace: (sppace?: Space) => void;
  isLoadingSpace: boolean;
  setIsLoadingSpace: (x: boolean) => void;
};

const SpaceContext = createContext<SpaceInterface | undefined>(undefined);

export function SpaceProvder({ children }: PropsWithChildren) {
  const [currentSpace, setCurrentSpace] = useState<Space>();
  const [isLoadingSpace, setIsLoadingSpace] = useState(false);

  const api = useMemo(
    () => ({
      currentSpace,
      setCurrentSpace,
      isLoadingSpace,
      setIsLoadingSpace,
    }),
    [currentSpace, isLoadingSpace],
  );

  return (
    <SpaceContext.Provider value={api}>
      {children}
      {!!currentSpace && <FloatingSpace space={currentSpace} />}
    </SpaceContext.Provider>
  );
}

export const useSpace = () => {
  const space = useContext(SpaceContext);

  if (!space) {
    throw new Error(
      "No SpaceProvider context found, please add provider to your application!",
    );
  }

  return space;
};
