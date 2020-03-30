import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const {width, height} = Dimensions.get('window');


export default function App() {

  const [videoUrl, setVideoUrl] = useState('https://r1---sn-b8u-btoe.googlevideo.com/videoplayback?expire=1585631084&ei=7F6CXoPLHZ3gj-8PpMqa-A4&ip=177.157.88.200&id=cad4de29e359d330&itag=18&source=blogger&mh=Jx&mm=31&mn=sn-b8u-btoe&ms=au&mv=m&mvi=0&pl=22&susc=bl&mime=video/mp4&dur=1485.125&lmt=1347567456466621&mt=1585602212&sparams=expire,ei,ip,id,itag,source,susc,mime,dur,lmt&sig=AJpPlLswRAIgRmgqTfUxwSsdKZx7czusSJvnUhUioxXyr4Sdm-Gk0pMCIH_6iEY9buFxqzynb34xtFb4ToM3DHX64P8YTrvtbOkN&lsparams=mh,mm,mn,ms,mv,mvi,pl&lsig=ALrAebAwRAIgQLqCB3cHH29I9LZQpFjD8neFydNmiifD7-ZpVkpwvD4CICbDDmCP9B-eTbBXsXV6Sa-GSgMn9TDxz6gKHvIrhAWS&cpn=_8HTxOCDeY-3ma1w&c=WEB_EMBEDDED_PLAYER&cver=202003274');
  const [buttonTitle, setButtonTitle] = useState('Download');
  const [status, setStatus] = useState('no action');
  const [progressValue, setProgressValue] = useState(0);
  const [totalSize, setTotalSize] = useState(0);

  function formatBytes(bytes, decimals = 2) {
    if(bytes === 0) return '0 bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  async function downloadVideo() {

    setButtonTitle('Downloading...');

    const callback = downloadProgress => {
      setTotalSize(formatBytes(downloadProgress.totalBytesExpectedToWrite));
      var progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      progress = progress.toFixed(2) * 100
      setProgressValue(progress.toFixed(0));
    };

    const downloadResumable = FileSystem.createDownloadResumable(
      videoUrl,
      FileSystem.documentDirectory + 'episaodio-001-hd.mp4',
      {},
      callback
    );

    try {
      const { uri } = await downloadResumable.downloadAsync();
      setStatus('dowloaded to: ' + uri);
      setVideoUrl(uri);
      setButtonTitle('Downloaded');
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View style={styles.container}>
      <Video 
        source={{uri: videoUrl}}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay={false}
        isLooping={false}
        useNativeControls
        style={styles.video}
      />
      <Button title={buttonTitle} onPress={downloadVideo} ></Button>
      <Text>Status: {status}</Text>
      <Text>Size: {totalSize}</Text>
      <Text>Progress: {progressValue} %</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  video: {
    width: width,
    height: height / 3,
    marginBottom: 40,
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
