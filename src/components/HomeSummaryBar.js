import { useState,useEffect } from 'react';
import { View } from 'react-native';
import {List, Text} from 'react-native-paper';
const SpendingInfo = ({debit,  credit}) => {
    const fontSize1 = 18
    return (
        <View style={{marginLeft:10, marginRight: 20, borderWidth: 0, width:50}}>
            <Text style={{color: 'green', fontSize:fontSize1}}>{credit}</Text>
            <Text style={{color: 'orange',fontSize:fontSize1}}>{debit}</Text>
        </View>
    );
}

const SpendingInfoDebit = ({credit}) => {
    const fontSize1 = 18
    return (
        <View style={{marginLeft:10, marginRight: 20, borderWidth: 0, width:50}}>
            <Text style={{color: 'orange',fontSize:fontSize1}}>{deibit}</Text>
        </View>
    );
}

const HomeSummaryBar = ({pickedDate, expenditureSummary}) => {
    // console.log("in HomeSummaryBar ->", expenditureSummary)
    const [expanded, setExpanded] = useState(true);
    const handlePress = () => setExpanded(!expanded);
    return (
        // <List.Section title="Accordions">
          <List.Accordion
            title={pickedDate}
            titleStyle={{fontSize:20,textAlign: "center", marginLeft:-30}}
            // description="Tet"
            left={props => <SpendingInfo debit={expenditureSummary.dailyExpenditure.debit} credit={expenditureSummary.dailyExpenditure.credit}/>}>
            <List.Item title="Weekly" left={() => null}  right={props => <SpendingInfo debit={expenditureSummary.weeklyExpenditure.debit} credit={expenditureSummary.weeklyExpenditure.credit}/>}/>
            <List.Item title="Monthly" left={() => null}  right={props => <SpendingInfo debit={expenditureSummary.monthlyExpenditure.debit} credit={expenditureSummary.monthlyExpenditure.credit}/>}/>
            <List.Item title="Yearly" left={() => null}  right={props => <SpendingInfo debit={expenditureSummary.yearlyExpenditure.debit} credit={expenditureSummary.yearlyExpenditure.credit}/>}/>
            {/* <List.Item title="Second item" /> */}
          </List.Accordion>
      );
}

export default HomeSummaryBar;