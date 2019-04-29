<template>
  <div class="app-container coin">
    <div class="search">
      <el-form
        ref="form"
        :inline="true"
      >
        <el-form-item label="交易对">
          <el-input v-model="symbol" />
        </el-form-item>
        <el-form-item label="挂单深度">
          <el-input v-model="dep" />
        </el-form-item>
        <el-button
          type="primary"
          @click="onSearch"
        >搜索</el-button>
      </el-form>
    </div>
    <div class="main-box">
      <div style="width: 65%; float: left;">
        <p>委托信息</p>
        <el-table
          v-loading="listLoading"
          :data="list.bids"
          element-loading-text="Loading"
          fit
          highlight-current-row
          style="width: 48%;float: left;"
        >
          >
          <el-table-column
            label="买入"
            width="50"
          >
            <template slot-scope="scope">
              {{ scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column label="买入价">
            <template slot-scope="scope">
              {{ scope.row.price }}
            </template>
          </el-table-column>
          <el-table-column label="委托单">
            <template slot-scope="scope">
              <span>{{ scope.row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column
            class-name="status-col"
            label=""
            width="100"
          >
            <template slot-scope="scope">
              <div
                class="line-bids"
                :style="{width:(scope.row.quantity/bidsMax*100)>1?scope.row.quantity/bidsMax*100+'px':1+'px'}"
              ></div>
            </template>
          </el-table-column>
        </el-table>

        <el-table
          v-loading="listLoading"
          :data="list.asks"
          element-loading-text="Loading"
          fit
          highlight-current-row
          style="width: 48%; float: left; margin-left:4%;"
        >
          >
          <el-table-column
            label="卖出"
            width="50"
          >
            <template slot-scope="scope">
              {{ scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column label="卖出价">
            <template slot-scope="scope">
              {{ scope.row.price }}
            </template>
          </el-table-column>
          <el-table-column label="委托单">
            <template slot-scope="scope">
              <span>{{ scope.row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column
            class-name="status-col"
            label=""
            width="100"
          >
            <template slot-scope="scope">
              <div
                class="line-asks"
                :style="{width:(scope.row.quantity/asksMax*100)>1?scope.row.quantity/asksMax*100+'px':1+'px'}"
              ></div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="width: 30%; float: left; margin-left:5%;">
        <p>最新成交</p>
        <el-table
          v-loading="listLoading2"
          :data="trades"
          element-loading-text="Loading"
          fit
          highlight-current-row
        >
          >
          <el-table-column label="时间">
            <template slot-scope="scope">
              {{ scope.row.time | parseTime('{h}:{i}:{s}') }}
            </template>
          </el-table-column>
          <el-table-column label="成交价">
            <template slot-scope="scope">
              {{ scope.row.price }}
            </template>
          </el-table-column>
          <el-table-column label="成交量">
            <template slot-scope="scope">
              <span :style="{color:scope.row.take=='sell'?'#f00':'#3207f3'}">{{ scope.row.quantity }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getOrderBook, getTrades } from "../../api/coin";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Table extends Vue {
  private list = {
    bids: [],
    asks: []
  };
  private listLoading = true;
  private listLoading2 = true;
  private asksMax = 1;
  private bidsMax = 1;
  private timer = 0;
  private trades = [];
  private symbol = "coniusdt";
  private dep = 200;
  private listQuery = {
    symbol: "coniusdt",
		dep: 200
  }

  private created() {
    this.fetchData();
    clearInterval(this.timer);
    this.setTimer();
  }

  private fetchData() {
    getOrderBook(this.listQuery.symbol, this.listQuery.dep).then(response => {
      this.list = response.orderbook
      this.jisuan(response.orderbook)
    });
    getTrades(this.listQuery.symbol, 300).then(response => {
      this.trades = response.trades;
      this.listLoading2 = false;
    });
  }

  private jisuan(orderbook: any) {
    for (let i = 0; i < orderbook.asks.length; i++) {
      orderbook.asks[i].quantity > this.asksMax
        ? (this.asksMax = orderbook.asks[i].quantity)
        : "";
    }
    for (let i = 0; i < orderbook.bids.length; i++) {
      orderbook.bids[i].quantity > this.bidsMax
        ? (this.bidsMax = orderbook.bids[i].quantity)
        : "";
    }
    this.listLoading = false;
  }

  private onSearch() {
    this.listQuery.symbol = this.symbol;
    this.listQuery.dep = this.dep;
    this.fetchData();
    clearInterval(this.timer);
    this.setTimer();
    this.asksMax = 0;
    this.bidsMax = 0;
  }
  private setTimer() {
    this.timer = setInterval(() => {
      this.fetchData();
    }, 2000);
  }
}
</script>
<style lang="scss">
.coin .el-table td {
  padding: 0;
}
.coin .line-bids {
  background: rgb(50, 7, 243);
  height: 10px;
}
.coin .line-asks {
  background: rgb(243, 7, 7);
  height: 10px;
}
.coin .main-box {
  overflow: hidden;
}
</style>