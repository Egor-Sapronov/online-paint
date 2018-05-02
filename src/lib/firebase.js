import firebase from 'firebase';
import 'firebase/firestore';

import { config } from '../firebase.config';

firebase.initializeApp(config);

const firestore = firebase.firestore()

firestore.settings({
    timestampsInSnapshots: true
});

const db = firebase.firestore();

export const drawingsCollection = db.collection('drawings');
export const usersCollection = db.collection('users');

export function login(name) {
    return new Promise((resolve) => {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
        .then(() => {
            firebase.auth().signInAnonymously();
    
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    usersCollection.doc(user.uid).set({
                        name,
                        color: getRandomColor(),
                    })
                    .then(() => usersCollection.doc(user.uid).get())
                    .then((userData) => {
                        resolve({
                            ...userData.data(),
                            id: userData.id,
                        })
                    });
                }
            })
        })
    });
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function convertItemToDb(item) {
    return {
        ...item,
        path: item.path.reduce((acc, item, index) => ({
            ...acc,
            [index]: item
        }),{}),
    }
}

export function deconvertItemFromDb(item) {
    return {
        ...item,
        path: Object.keys(item.path).map((key) => item.path[key])
    }
}