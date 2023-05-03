import { AxiosInstance } from "axios";

import { CreateTask, CreateProducts, JitserStoreDetails } from "../types";
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
  // fp
  public sendVerificationFP(email: string) {
    return this.axios.post(`/api/fp/send-fp-email/${email}`);
  }
}
