/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    TouchableOpacity,
    TextInput
} from 'react-native';

import { WebView } from 'react-native-webview';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import DocumentPicker from 'react-native-document-picker';

import axios from 'axios'

import {
    chunkSizeDefault,
    chunkMaxSize,
    statusFileOperation,
    FieldFiles,
    conversionRateUnitData,
    endPoints,
    WebviewLayout
} from "./const";


const dataProps = {
    bandwidth: 1024 ** 2,
};

function App() {
    const isDarkMode = useColorScheme() === 'dark';

    const [statusFiles, setStatusFiles] = React.useState({});
    let [counter, setCounter] = React.useState(1);

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const chunkSize =
        dataProps?.bandwidth >= chunkSizeDefault &&
        dataProps?.bandwidth <= chunkMaxSize
            ? dataProps?.bandwidth
            : chunkSizeDefault;

    const handleUpload = () => {
    }


    const webviewRef = React.useRef();

    const sendDataToWebView = () => { 
        webviewRef.current?.postMessage('Data from react native app')
    }

    // const INJECTED_JAVASCRIPT = `(function() {
    //     window.ReactNativeWebView.postMessage(JSON.stringify(window.location));
    // })();`;

    const INJECTED_JAVASCRIPT = `(function() {
        window.ReactNativeWebView.postMessage("ha ha ha");
    })();`;

    const onMessage = (data) => {
        alert(data.nativeEvent.data);
    }

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}>
                <Header />

                <TextInput >aaa</TextInput>
                
                <TouchableOpacity
                    style={styles.buttonStyle}
                    activeOpacity={0.5}
                    onPress={async () => {
                    try {
                        const pickerResult = await DocumentPicker.pickSingle({
                            presentationStyle: 'fullScreen',
                            copyTo: 'cachesDirectory',
                        })
                        /*
                        {"fileCopyUri": "file:///Users/longle/Library/Developer/CoreSimulator/Devices/1D01E050-0EC0-4C4A-AE24-928726948793/data/Containers/Data/Application/A780D502-637D-4C74-860F-A4ACAB32EEE9/Library/Caches/FD6965DB-BE71-426A-A799-34183BBB7902/eduardo-bergen-a1V5iA9UTDc-unsplash.jpg", "name": "eduardo-bergen-a1V5iA9UTDc-unsplash.jpg", "size": 2552150, "type": "image/jpeg", "uri": "file:///Users/longle/Library/Developer/CoreSimulator/Devices/1D01E050-0EC0-4C4A-AE24-928726948793/data/Containers/Data/Application/A780D502-637D-4C74-860F-A4ACAB32EEE9/tmp/org.reactjs.native.example.rnHasaki-Inbox/eduardo-bergen-a1V5iA9UTDc-unsplash.jpg"}
                        */
                        
                        const res = await fetch(pickerResult.uri)
                        const blobFile = await res.blob()
                        console.log("------> blobFile: ", blobFile)
                        const statusFiles = statusFileOperation(blobFile, chunkSize);
                        setStatusFiles(statusFiles);
                    } catch (e) {
                        console.log("e: ", e)
                    }
                    }}>
                    <Text style={styles.buttonTextStyle}>Select File</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                    style={styles.buttonStyle}
                    activeOpacity={0.5}
                    onPress={sendDataToWebView}>
                    <Text style={styles.buttonTextStyle}>Send data to webview</Text>
                </TouchableOpacity> */}
            
            
                <View style={{ borderColor: 'red', borderWidth: 1, borderStyle: 'solid', height: 500}} ref={webviewRef}>
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: WebviewLayout }}
                        mixedContentMode="compatibility"
                        onMessage={onMessage}
                        injectedJavaScript={INJECTED_JAVASCRIPT}
                        javaScriptEnabled
                        domStorageEnabled
                    />
                    <WebView
                        source={{ uri: 'http://localhost:3000/' }}
                        style={{ marginTop: 20 }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    buttonStyle: {
        backgroundColor: '#307ecc',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#307ecc',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 15,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
});

export default App;
