import { AxiosInstance } from "axios";

import { CreateTask, CreateProducts, JitserStoreDetails, FPChangePasswordProps } from "../types";
export class MdrApi {
  constructor(private readonly axios: AxiosInstance) {}

  public fetchUsersReport() {
    return this.axios.get("/api/users/find-all-users-report");
  }
  public fetchUsersBasedType(usertype: any) {
    return this.axios.get(`/api/Task/fetch-users-based-usertype/${usertype}`);
  }
  public createTask(props: CreateTask) {
    return this.axios.post<CreateTask>("/api/Task/create-task", props);
  }
  public fetchAllTask() {
    return this.axios.get("/api/task/get-all-task");
  }
  public signoutUser(uuid: any) {
    return this.axios.put(`/api/token/destroy-signout/${uuid}`);
  }
  public deletionTask(uuid: any) {
    return this.axios.delete(`/api/task/delete-ticket/${uuid}`);
  }
  public IdentifyUserTypeFunc(uuid: any) {
    return this.axios.get(`/api/token/identify-user-type/${uuid}`);
  }
  public ProductCategoryList() {
    return this.axios.get("/api/productcategory/fetch-all-category");
  }
  public ProductManagementCreation(props: CreateProducts) {
    return this.axios.post("/api/productmanagement/create-new-products", props);
  }
  public ProductSystemGen(props: { product_id: any }) {
    return this.axios.post("/api/systemgen/gen-products-system-gen", props);
  }
  public ProductList() {
    return this.axios.get("/api/productmanagement/get-all-products");
  }
  public CreateProductCategory(props: {
    label: string;
    value: string;
    type: string;
  }) {
    return this.axios.post("/api/productcategory/create-new-category", props);
  }
  public FetchAllCategories() {
    return this.axios.get("/api/productcategory/get-all-new-categories");
  }
  // Jitser
  public StoreMeetDetails(props: JitserStoreDetails) {
    return this.axios.post("/api/jitser/store-jitser-details", props);
  }
  public GetAllRooms() {
    return this.axios.get("/api/jitser/get-all-rooms");
  }
  public JoinRoomStoreDetails(props: { roomId : number, name: string }) {
    return this.axios.post(`/api/jitser/join-meet/${props.name}/${props.roomId}`)
  }
  public HangOutCall(name: string){
    return this.axios.delete(`/api/jitser/hang-out-meeting/${name}`)
  }
  public DeleteRoom(id: number) {
    return this.axios.delete(`/api/jitser/delete-room/${id}`)
  }
  // fp
  public sendVerificationFP(email: string) {
    return this.axios.post(`/api/fp/send-fp-email/${email}`);
  }
  public checkVerification(props: { email: string | undefined; code: string }) {
    return this.axios.post(
      `/api/fp/check-code-verification/${props.code}/${props.email}`
    );
  }
  public resendVerification(email: string | undefined) {
    return this.axios.post(`/api/fp/resend-code-verification/${email}`);
  }
  public changePassword(props : FPChangePasswordProps) {
    return this.axios.post('/api/fp/fp-change-password', props)
  }
}
