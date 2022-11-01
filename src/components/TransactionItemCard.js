import {Button, Modal, StyleSheet, Text, View} from 'react-native';

const TransactionItemCard = (props) => {
    return (
        // <View>
        //     <Text>{props.title} -- {props.amount} -- {props.label}</Text>
        // </View>

        <View style={styles.mycard}>
            {/* <Text>{props.title} -- {props.amount}</Text> */}
            <View style={styles.leftcontent}>
                <Text>{props.title}</Text>
                <Text>{props.label}</Text>
            </View>
            <View style={styles.rightcontent}>
                <Text>{props.amount}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mycard: {
        // position: "absolute",
        width: "auto",
        height:"auto",
        borderWidth: 2,
        borderRadius: 5,
        shadowColor: "rgb(0,0,0)",
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        backgroundColor: "rgb(0,0,0,0.5)",
        padding: 5,
        marginTop: 5,
        marginHorizontal: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    leftcontent: {
        width: "auto",
        height: "auto",
        // backgroundColor: "rgb(0,0,0)",
        // borderWidth: 2,
        padding: 5,
        display: "flex",
        color: "rgba(251,206, 205,1)",
        
        flexDirection: "column",
        justifyContent:"center",
    },
    rightcontent: {
        width: "auto",
        height: "auto",
        // position:"relative",
        // borderWidth: 2,
        borderColor: "rgb(200,0,0)",
        // backgroundColor: "rgb(0,0,0)",
        padding: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent:"flex-end",
        alignItems: "flex-end",
        alignSelf: "auto",
        // flexShrink: 0,
    }
  });

export default TransactionItemCard;