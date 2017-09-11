import React, { Component } from "react";
import { connect } from "react-redux";
import Stocks from "../components/Stocks";
import { stockActions } from "../actions";

class StocksContainer extends Component {
  componentDidMount() {
    this.props.hydrateStocks();
  }

  onSort = column => () => {
    const direction =
      this.props.sort.column === column ? !this.props.sort.direction : true;
    this.props.updateSort(column, direction);
  };

  onFilter = event => {
    this.props.updateFilter(event.target.value);
  };

  render() {
    return (
      <Stocks {...this.props} onSort={this.onSort} onFilter={this.onFilter} />
    );
  }
}

const filterStocks = (stocks, date) => {
  let selection = stocks.records[date];
  if (selection) {
    selection = Object.values(selection);

    if (stocks.filter) {
      selection = selection.filter(stock =>
        stock.Ticker.includes(stocks.filter.toUpperCase())
      );
    }

    const { column, direction } = stocks.sort;
    selection = selection.sort((a, b) => {
      [a, b] = [a[column], b[column]];
      if (!direction) [a, b] = [b, a];
      if (!isNaN(parseFloat(a))) [a, b] = [parseFloat(a), parseFloat(b)];

      if (a > b) return 1;
      if (a < b) return -1;
      else return 0;
    });

    return selection.slice(0, 15);
  } else {
    return [];
  }
};

const mapStateToProps = state => {
  return {
    stocks: filterStocks(state.stocks, state.dates.current),
    date: state.dates.current,
    sort: state.stocks.sort,
    filter: state.stocks.filter
  };
};

const mapDispatchToProps = dispatch => ({
  hydrateStocks: () => dispatch(stockActions.hydrateStocks()),
  updateSort: (column, direction) =>
    dispatch(stockActions.setSort(column, direction)),
  updateFilter: filter => dispatch(stockActions.setFilter(filter))
});

// export default () => <StocksContainer />;
export default connect(mapStateToProps, mapDispatchToProps)(StocksContainer);
