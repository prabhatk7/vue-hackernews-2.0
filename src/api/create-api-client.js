import Firebase from 'firebase/app'                     
import 'firebase/database'

export function createAPI ({ config, version }) {             //export createAPI function which takes an object with config and version parameters
  Firebase.initializeApp(config)                              //firebase is initialized with provided config
  return Firebase.database().ref(version)                     //return firebase database
}
