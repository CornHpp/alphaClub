// counterSlice.ts 文件

import { createSlice } from "@reduxjs/toolkit";

export interface cryptoState {
  ethPrice: number;
  walletAddress: string;
  walletBalance: number;
}
const initialState: cryptoState = {
  ethPrice: 1700,
  walletAddress: "",
  walletBalance: 0,
};

// 创建一个 Slice
export const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  // 定义 reducers 并生成关联的操作
  reducers: {
    // 定义一个加的方法
    setEthPrice: (state, action) => {
      state.ethPrice = action.payload;
    },
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload;
    },
    setWalletBalance: (state, action) => {
      state.walletBalance = action.payload;
    },
  },
});
// 导出加减的方法
export const { setEthPrice, setWalletAddress, setWalletBalance } = cryptoSlice.actions;

// 默认导出
export default cryptoSlice.reducer;
