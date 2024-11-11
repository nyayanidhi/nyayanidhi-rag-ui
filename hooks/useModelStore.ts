import { create } from "zustand";

export type FileWithOption = {
  file: File | null;
  option: string;
};

type ProgressState = {
  bears: number;
  increase: (by: number) => void;
  decrease: (by: number) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isAlert: boolean;
  setAlert: (isAlert: boolean) => void;
  files: FileWithOption[]; // Change this to an array of FileWithOption objects
  setFiles: (files: FileWithOption[]) => void; // Change this to accept an array of FileWithOption objects
  outputType: string;
  setOutputType: (outputType: string) => void;
  iFiles: FileWithOption[];
  setIFiles: (iFiles: FileWithOption[]) => void;
};

export const useProgressStore = create<ProgressState>((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
  decrease: (by) => set((state) => ({ bears: state.bears - by })),
  loading: false,
  setLoading: (loading) => set(() => ({ loading })), // Update this to set the loading field
  isAlert: false,
  setAlert: (isAlert) => set(() => ({ isAlert })),
  files: [], // Initialize the files field as an empty array
  setFiles: (files) => set(() => ({ files })), // Update this to set the files field
  outputType: "",
  setOutputType: (outputType) => set(() => ({ outputType })),
  iFiles: [],
  setIFiles: (iFiles) => set(() => ({ iFiles })),
}));
