export interface AdvancerProps {
  active: boolean
  value: any
  onHop: (value: any, chosenCaseId?: string) => void
}
