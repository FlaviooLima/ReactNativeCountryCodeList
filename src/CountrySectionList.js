import React from 'react';
import {
   View,
   Text,
   LayoutAnimation,
   SectionList,
} from 'react-native';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'

import { Button } from 'react-native-elements';

export default class CountrySectionList extends React.PureComponent {
   constructor(props) {
      super(props)
      this.state = {};

      this.getItemLayout = sectionListGetItemLayout({
         getItemHeight: (rowData, sectionIndex, rowIndex) => 41,
         getSeparatorHeight: () => 0,
         getSectionHeaderHeight: () => 25, // The height of your section headers
         getSectionFooterHeight: () => 0, // The height of your section footers
      })
   }

   _onPressItem = (name, code) => { this.props.onPress(name, code); };

   render() {
      return (
         <View style={{ flex: 1, flexDirection: 'row' }}>
            <SectionList
               ref={component => this._listView = component}
               style={{ flex: 1, }}
               sections={this.props.data}
               keyExtractor={(item, index) => index}
               renderItem={({ item }) => <CountryItem item={item} onPressItem={this._onPressItem} />}
               renderSectionHeader={({ section }) => <CountryHeader title={section.title} />}
               getItemLayout={this.getItemLayout}
               stickySectionHeadersEnabled={true}
               removeClippedSubviews={false}
            />

            <AlphabetList data={this.props.data} onSectionSelect={this.scrollToSections} />

         </View>
      )
   }


   scrollToSections = (sectionID) => {
      if (!sectionID && !this._listView) { return false; }
      this._listView.scrollToLocation({
         animated: true,
         viewOffset: 0,
         viewPosition: 0.05, //for some reason if i dont set this way, it will scroll to a wrong position, i believe there is a bug in sectionList component,
         //  it dosent count the section height being diferrent from row height
         sectionIndex: sectionID,
         itemIndex: 0,
      });
   }

}


class CountryItem extends React.PureComponent {
   _onPress = () => { this.props.onPressItem(this.props.item.name, this.props.item.code); };
   render() {
      return (
         <Button
            containerViewStyle={{ width: '100%', marginLeft: 0, height: 41, overflow: 'hidden' }}
            onPress={this._onPress}
            backgroundColor={"white"}
            textStyle={{ fontSize: 14, textAlign: 'left', fontWeight: '400', color: "black", width: '100%', }}
            title={this.props.item.name}
         />
      );
   }
}
class CountryHeader extends React.PureComponent {
   render() {
      return (
         <Text style={{ backgroundColor: '#f8f8f8', fontWeight: '600', paddingTop: 4, paddingBottom: 4, paddingLeft: 10, height: 25, overflow: 'hidden' }}>{this.props.title}</Text>
      );
   }
}

class AlphabetList extends React.PureComponent {
   constructor(props) {
      super(props);
      this.lastSelectedIndex = null;
   }

   render() {
      return (
         <View ref="view" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', width: 30, backgroundColor: 'transparent' }}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={this.detectAndScrollToSection}
            onResponderMove={this.detectAndScrollToSection}
            onResponderRelease={this.resetSection}>

            {this.props.data.map((section, index) => {
               return (
                  <View key={index} ref={'sectionItem' + index} pointerEvents="none">
                     <View style={{ padding: 0 }}>
                        <Text style={{ fontWeight: '700', color: '#008fff' }}>{section.title}</Text>
                     </View>
                  </View>
               );
            })}
         </View>
      );
   }

   onSectionSelect = (sectionId, fromTouch) => {
      this.props.onSectionSelect && this.props.onSectionSelect(sectionId);
      if (!fromTouch) { this.lastSelectedIndex = null; }
   }

   resetSection = () => {
      this.lastSelectedIndex = null;
   }

   detectAndScrollToSection = (e) => {
      const ev = e.nativeEvent.touches[0];

      const targetY = ev.pageY;
      const { y, width, height } = this.measure;
      if (!y || targetY < y) {
         return;
      }
      let index = Math.floor((targetY - y) / height);
      index = Math.min(index, this.props.data.length - 1);
      if (this.lastSelectedIndex !== index && this.props.data[index].data.length) {
         this.lastSelectedIndex = index;
         this.onSectionSelect(index, true);
      }
   }

   fixSectionItemMeasure = () => {
      const sectionItem = this.refs.sectionItem0;
      if (!sectionItem) {
         return;
      }
      this.measureTimer = setTimeout(() => {
         sectionItem.measure((x, y, width, height, pageX, pageY) => {
            this.measure = {
               y: pageY,
               width,
               height
            };
         })
      }, 0);
   }

   componentDidMount = () => {
      this.fixSectionItemMeasure();
   }


   componentDidUpdate = () => {
      this.fixSectionItemMeasure();
   }

   componentWillUnmount = () => {
      this.measureTimer && clearTimeout(this.measureTimer);
   }

}
