import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
const {width, height} = Dimensions.get('window');

const Loading = (props) => {
    return (
        <View style={{width: width, height: height, position: props.loading ? 'absolute': 'relative', display: props.loading ? 'flex': 'none'}}>
            <View style={[styles.loading]}>
                <LottieView
                    autoPlay
                    style={{width: 100, height: 100 }}
                    source={require('../assets/loading.json')}
                />
            </View>
        </View>
    )
}

const styles = new StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export default Loading;