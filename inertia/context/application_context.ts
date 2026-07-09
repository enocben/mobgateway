import { create } from 'zustand'
import {Data} from "@generated/data";

interface ApplicationContext {
  applicationId?: string
  applications: Data.Application[]

  setApplications: (apps: Data.Application[]) => void
  setApplication: (appId: string) => void
}

export const useApplicationStore = create<ApplicationContext>((set) => ({
  applicationId: undefined,
  applications: [],

  setApplications: (apps) =>
    set({
      applications: apps,
      applicationId: apps[0].id
    }),

  setApplication: (applicationId) => set({
      applicationId
    }),
}))
