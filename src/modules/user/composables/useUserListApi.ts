import { ref } from "vue";
import { userService_detail } from "../services/userDetail.service";
import type { User } from "../interfaces/user.interface";

export function useUserListApi(callback: (data: User | null) => void) {
  const currentUserId = ref<string | null>(null);
  const photoUrl = ref<string | null>(null);

  async function fetchList() {
    const data = await userService_detail();

    currentUserId.value = data ? data.id : null;
    photoUrl.value = data ? data.photoUrl : null;
    callback(data);
  }

  return { currentUserId, photoUrl, fetchList };
}
