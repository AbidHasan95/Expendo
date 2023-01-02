import { useState,useEffect } from 'react';
import { View } from 'react-native';
import {List, Text,Card} from 'react-native-paper';
const SpendingInfo = ({debit,  credit}) => {
    const fontSize1 = 18
    return (
        <View style={{marginLeft:10, marginRight: 0, borderWidth: 0, width:70}}>
            <Text style={{color: 'green', fontSize:fontSize1, textAlign:'right'}}>{credit}</Text>
            <Text style={{color: 'orange',fontSize:fontSize1, textAlign:'right'}}>{debit}</Text>
        </View>
    );
}
const SpendingInfoTop = ({debit,  credit}) => {
    const fontSize1 = 18
    return (
        <View style={{marginLeft:10, marginRight: 20, borderWidth: 0, width:70}}>
            <Text style={{color: 'green', fontSize:fontSize1, textAlign:'left'}}>{credit}</Text>
            <Text style={{color: 'orange',fontSize:fontSize1, textAlign:'left'}}>{debit}</Text>
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

const HomeSummaryBar = ({pickedDate, expenditureSummary, theme}) => {
    // console.log("in HomeSummaryBar ->", expenditureSummary)
    const [expanded, setExpanded] = useState(true);
    const handlePress = () => setExpanded(!expanded);
    return (
        // <List.Section title="Accordions">
        // <Card>
        //     <Card.Content style={{margin:0}}>
                <List.Accordion
                    title={pickedDate}
                    titleStyle={{fontSize:20,textAlign: "center", marginLeft:-40}}
                    // description="Thursday"
                    style={{borderTopWidth:0.4,borderBottomWidth:0.4,marginBottom:2,borderRadius:10,backgroundColor:"transparent", borderColor: theme.colors.outline}}
                    left={props => <SpendingInfoTop debit={expenditureSummary.dailyExpenditure.debit} credit={expenditureSummary.dailyExpenditure.credit}/>}>
                    <List.Item title="Weekly" left={() => null}  right={props => <SpendingInfo debit={expenditureSummary.weeklyExpenditure.debit} credit={expenditureSummary.weeklyExpenditure.credit}/>}/>
                    <List.Item title="Monthly" left={() => null}  right={props => <SpendingInfo debit={expenditureSummary.monthlyExpenditure.debit} credit={expenditureSummary.monthlyExpenditure.credit}/>}/>
                    <List.Item title="Yearly" left={() => null}  right={props => <SpendingInfo debit={expenditureSummary.yearlyExpenditure.debit} credit={expenditureSummary.yearlyExpenditure.credit}/>}/>
                    {/* <List.Item title="Second item" /> */}
                </List.Accordion>
        //     </Card.Content>
        // </Card>
      );
}

export default HomeSummaryBar;