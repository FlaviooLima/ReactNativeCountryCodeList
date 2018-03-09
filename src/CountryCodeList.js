import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  SectionList
} from 'react-native';
import { getAlphabet } from './data'
import CountrySectionList from './CountrySectionList';
import Search from 'react-native-search-box';
import PropTypes from 'prop-types';

class CountryCodeList extends React.Component {
  constructor(props) {
    super(props)
    this.onSearch = this.onSearch.bind(this);
    this.clearQuery = this.clearQuery.bind(this);

    this.state = {
      data: this.props.data ? this.props.data : getAlphabet(),
      query: ''
    }

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = (event) => {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'cancelModalCountry') {
        this.props.navigator.dismissModal();
        return true;
      }
    }
  }

  render() {
    let data = this.filterData()
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Search
          afterCancel={this.clearQuery}
          afterDelete={this.clearQuery}
          onChangeText={this.props.onSearch ? this.props.onSearch : this.onSearch}
          backgroundColor={this.props.headerBackground}
          titleCancelColor={'rgb(0, 0, 0)'}
          tintColorSearch={'rgb(0, 0, 0)'}
          inputStyle={styles.searchInput}
          {...this.props.searchProps}
        />
        <CountrySectionList
          data={data}
          onPress={this.props.onPress}
        />

      </View>
    )
  }

  filterData() {
    try {
      var arrayAux = [];

      this.state.data.map((data) => {

        var auxArrayCoutry = [];
        data.data.map((country) => {
          if (country.name.search(this.state.query) >= 0) { auxArrayCoutry.push(country); }
        });

        if (auxArrayCoutry.length) { arrayAux.push({ title: data.title, data: auxArrayCoutry }); }
      });

      return arrayAux;
    } catch (e) {
      return this.state.data
    }
  }

  clearQuery() {
    this.setState({ query: '' })
  }

  onSearch(query) {
    this.setState({ query })
  }

  renderSectionHeader(rowData) {
    if (this.props.renderSectionHeader) {
      return this.props.renderSectionHeader(rowData)
    }
    return (
      <View style={[
        styles.sectionHeader,
        this.props.sectionHeaderStyle,
        { backgroundColor: this.props.headerBackground, height: this.props.sectionHeaderHeight - 1 }
      ]}>
        <Text style={[styles.sectionHeaderText, this.props.sectionHeaderTextStyle]}>{rowData.title}</Text>
      </View>
    )
  }

  renderSectionItem(rowData) {
    if (this.props.renderSectionItem) {
      return this.props.renderSectionItem(rowData)
    }
    return (
      <Text style={[styles.sectionItemText, this.props.sectionItemTextStyle]}>{rowData.title}</Text>
    )
  }

  renderCell(rowData) {
    if (this.props.renderCell) {
      return this.props.renderCell(rowData)
    }
    return (
      <View>
        <TouchableOpacity
          onPress={() => { this.props.onClickCell(rowData.item) }}
          style={[styles.cell, this.props.cellStyle, { height: this.props.cellHeight - 0.5 }]}>
          <Text numberOfLines={1} style={[styles.cellTitle, this.props.cellTitleStyle]}>{rowData.item.name}</Text>
          <Text style={[styles.cellLabel, this.props.cellLabelStyle]}>{rowData.item.code}</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sectionHeader: {
    justifyContent: 'center',
    top: -1,
    paddingLeft: 20,
  },
  sectionHeaderText: {
    justifyContent: 'center',
    fontSize: 16,
    color: 'rgb(0,0,0)'
  },
  sectionItemText: {
    color: 'rgb(153, 205, 55)',
    fontSize: 12,
  },
  cell: {
    paddingLeft: 20,
    paddingRight: 31,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  separator: {
    backgroundColor: 'rgb(0, 0, 0)',
    height: 0.5,
    opacity: 0.05,
    marginLeft: 20,
    marginRight: 25,
  },
  cellTitle: {
    fontSize: 16,
    flex: 1,
    paddingRight: 10,
    color: 'rgb(0, 0, 0)',
  },
  cellLabel: {
    fontSize: 16,
    color: 'rgb(0, 0, 0)',
  },
  searchInput: {
    backgroundColor: 'white'
  }
});

CountryCodeList.propTypes = {
  data: PropTypes.object,
  // alphabetListProps it is prop react-native-alphabetlistview
  alphabetListProps: PropTypes.object,
  // searchProps it is prop react-native-search-box
  searchProps: PropTypes.object,
  onSearch: PropTypes.func,
  onClickCell: PropTypes.func,
  headerBackground: PropTypes.any,
  cellHeight: PropTypes.number,
  sectionHeaderHeight: PropTypes.number,
  renderCell: PropTypes.func,
  renderSectionItem: PropTypes.func,
  renderSectionHeader: PropTypes.func,
  sectionHeaderStyle: PropTypes.any,
  sectionHeaderTextStyle: PropTypes.any,
  sectionItemTextStyle: PropTypes.any,
  cellStyle: PropTypes.any,
  cellTitleStyle: PropTypes.any,
  cellLabelStyle: PropTypes.any,
  containerStyle: PropTypes.any,
};

CountryCodeList.defaultProps = {
  headerBackground: 'rgb(245, 245, 245)',
  cellHeight: 44.5,
  sectionHeaderHeight: 30,
  containerStyle: { backgroundColor: 'white' },
  onClickCell: () => { }
};

module.exports = CountryCodeList;
