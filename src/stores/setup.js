import { apiBase, } from "@/config"
import { getToken } from "@/utilities/common"
import { showNotification } from "@/utilities/common"
import axios from "axios"

export const getAllBranch = async () => {
    let res = [];
    try {
        res = await axios.get(`${apiBase}/all-branch`, getToken())
    } catch (error) {
        res = [];
        showNotification("error", error?.response?.data?.message || error?.message)
    }
    return res?.data || []
}
