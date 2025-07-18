import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../Api/axios";
import { useDispatch, useSelector } from "react-redux";
import { setAllGroups, setGroupSelected } from "../../Store/Slices/Group-slice";
import type { RootState } from "../../Store/store";

// groupRouter.put("/update/:groupId", isAuthenticated, updateGroupInfo);
const useRemoveFromGroup = () => {
  const dispatch = useDispatch();
  const { groups } = useSelector((state: RootState) => state.group);
  const [removingFromGroup, setRemovingFromGroup] = useState<boolean>(false);

  const removeFromGroupHandler = async (groupId: string, memberId: string) => {
    try {
      setRemovingFromGroup(true);
      const response = await api.put(
        `/api/v1/groups/remove-member/${groupId}/${memberId}`,
        "",
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success("Removed from group");
        dispatch(setGroupSelected(response.data?.group));
        dispatch(
          setAllGroups([
            ...groups.map((group) =>
              group._id === response.data?.group._id
                ? response.data?.group
                : group
            ),
          ])
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Something went wrong");
      }
    } finally {
      setRemovingFromGroup(false);
    }
  };
  return { removeFromGroupHandler, removingFromGroup };
};

export default useRemoveFromGroup;
