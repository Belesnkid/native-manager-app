export default interface ReimbursementRequest{
    id:string
    employeeId:string
    amount:number
    empReason?:string
    manReason?:string
    pending:boolean
    approved?:boolean
}