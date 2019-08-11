# 1. Overview


FriendlyEats-React is an app for Firebase / Firestore tutorials using React. You can create an application that uses Firestore with minimal programming to learn Firestore.

<img width="715" alt="sample.jpg" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/25071/35cbad6f-5aa6-25aa-27db-dc9a3be00b75.jpeg">

What you'll learn
- Read and write data to Cloud Firestore from a web app
- Listen to changes in Cloud Firestore data in real time
- Use Firebase Authentication and security rules to secure Cloud Firestore data
- Write complex Cloud Firestore queries

What you'll need
Before starting this codelab, make sure that you've installed:

- npm which typically comes with Node.js - Node v8 is recommended
- The IDE/text editor of your choice, such as WebStorm, Atom, VS Code, or Sublime

Note: Although Node.js is a requirement for running and testing our app during development, the final application will not be dependent on Node.js.

# 2. Create and set up a Firebase project

### Create a Firebase project
1. In the Firebase console, click Add project, then name the Firebase project FriendlyEats.
Remember the Project ID for your Firebase project.
1. Click Create project.

> Important: Your Firebase project will be named FriendlyEats, but Firebase will automatically assign it a unique Project ID in the form friendlyeats-1234. This unique identifier is how your project is actually identified (including in the CLI), whereas FriendlyEats is simply a display name.
v
The application that we're going to build uses a few Firebase services available on the web:

- Firebase Authentication to easily identify your users
- Cloud Firestore to save structured data on the Cloud and get instant notification when the data is updated
- Firebase Hosting to host and serve your static assets

For this specific codelab, we've already configured Firebase Hosting. However, for Firebase Auth and Cloud Firestore, we'll walk you through the configuration and enabling of the services using the Firebase console.

### Enable Anonymous Auth
Although authentication isn't the focus of this codelab, it's important to have some form of authentication in our app. We'll use Anonymous login - meaning that the user will be silently signed in without being prompted.

You'll need to enable Anonymous login.

1. In the Firebase console, locate the Develop section in the left nav.
1. Click Authentication, then click the Sign-in method tab (or click here to go directly there).
1. Enable the Anonymous Sign-in Provider, then click Save.

![fee6c3ebdf904459.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/25071/9c268b6e-a018-0566-8d49-0e8e2e76fe5f.png)

This will allow the application to silently sign in your users when they access the web app. Feel free to read the Anonymous Authentication documentation to learn more.

### Enable Cloud Firestore
The app uses Cloud Firestore to save restaurant info and receive updated restaurant's rating.

You'll need to enable Cloud Firestore:

1. In the Firebase console's Develop section, click Database.
1. Click Create database in the Cloud Firestore pane.
![8c5f57293d48652.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/25071/4b85b657-394d-60ea-46f0-6e97615342f6.png)
1. Select the Start in test mode option, then click Enable after reading the disclaimer about the security rules.

Test mode ensures that we can freely write to the database during development. We'll make our database more secure later on in this codelab.

![620b95f93bdb154a.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/25071/63f6c46d-a2fd-a149-4224-c408ec3e8b2f.png)



# 3. Get the sample code and install

Clone the GitHub repository from the command line:

```
git clone https://github.com/isamu/FriendlyEats-React
```

The sample code should have been cloned into the 📁FriendlyEats-React directory, make sure your command line are ran from this directory from now on:

```
cd FriendlyEats-React
```

### npm packages

install npm packages

```
npm install
```
### Setup Firebase configurations

In the Firebase console, you can get Firebase web configuration, then you need to copy the configuration to src/config.js.

- Open the firebase console (from https://firebase.google.com) and add a project
- From the dashboard of this project, add an app and choose "web" (</>).
- From the setting of this app, choose "Config" (in Firebase SDK snippet)
- Copy the config file, and paste into src/config.js file.  

### Import the starter app
Using your IDE (WebStorm, Atom, Sublime, Visual Studio Code...) open or import the 📁friendlyeats-web directory. This directory contains the starting code for the codelab which consists of a not-yet functional restaurant recommendation app. We'll make it functional throughout this codelab so you will need to edit code in that directory soon.


# 4. Install the Firebase Command Line Interface
The Firebase Command Line Interface (CLI) allows you to serve your web app locally and deploy your web app to Firebase Hosting.

Note: To install the CLI, you need to install npm which typically comes with NodeJS.

1 . Install the CLI by running the following npm command:

```
npm -g install firebase-tools
```

>Doesn't work? You may need to change npm permissions.

2 . Verify that the CLI has been installed correctly by running the following command:

```
firebase --version
```
Make sure the version of the Firebase CLI is v6.2.0 or later.

3 . Authorize the Firebase CLI by running the following command:

```
firebase login
```
We've set up the web app template to pull your app's configuration for Firebase Hosting from your app's local directory and files. But to do this, we need to associate your app with your Firebase project.

4 . Make sure that your command line is accessing your app's local directory.
5 . Associate your app with your Firebase project by running the following command:

```
firebase use --add
```
6 . When prompted, select your Project ID, then give your Firebase project an alias.
An alias is useful if you have multiple environments (production, staging, etc). However, for this codelab, let's just use the alias of default.

7 . Follow the remaining instructions in your command line.

# 5. Run React on your local computor.
We're ready to actually start work on our app! Let's run our app locally!

1 . Run this command on your local CLI:

```
npm start
```

2 . You can see the message if it is success.

```
  Local:            http://localhost:3000/
```

The React instance will run on your local computer. You can see web app on browser to open http://localhost:3000. Sometimes open browser automatically as running React. the number 3000 is port number. You may see different port number.

3 . Open http://localhost:3000 on your browser.

You should see your copy of FriendlyEats which has been connected to your Firebase project.

The app has automatically connected to your Firebase project and silently signed you in as an anonymous user.

<img width="771" alt="スクリーンショット 2019-08-03 4.28.16.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/25071/e20ecc4f-34a1-9044-f0f9-73913dff3a43.png">


# 6. Write data to Cloud Firestore
In this section, we'll write some data to Cloud Firestore so that we can populate the app's UI. This can be done manually via the Firebase console, but we'll do it in the app itself to demonstrate a basic Cloud Firestore write.

### Data Model
Firestore data is split into collections, documents, fields, and subcollections. We will store each restaurants as a document in a top-level collection called restaurants.

![6010184d388a897.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/25071/d45258ad-7389-7cc4-60ec-98f218f1a9a5.png)



Later, we'll store each reviews in a subcollection called ratings in each restaurants.

![7d949c3471e49573.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/25071/a94dc013-8ea3-8b84-a074-a730ad75da76.png)


> Tip: To learn more about the Firestore data model, read about documents and collections in the documentation.

### Add restaurants to Firestore

The main model object in our app is a restaurant. Let's write some code that adds a restaurant document to the restaurants collection.

1. From your downloaded files, open src/FriendlyEats/FriendlyEats.Data.js.
1. Find the function addRestaurant.
1. Replace the entire function with the following code.


[FriendlyEats.Data.js](https://github.com/isamu/FriendlyEats-React/blob/master/src/FriendlyEats/FriendlyEats.Data.js#L4-L8.js)

```
export const addRestaurant = (data) => {
  const collection = firebase.firestore().collection('restaurants');
  return collection.add(data);
};
```

The code above adds a new document to the restaurants collection. The document data comes from a plain JavaScript object. We do this by first getting a reference to a Cloud Firestore collection restaurants then add'ing the data.

### Let's add restaurants!

1. Go back to your FriendlyEats app in your browser and refresh it.
1. Click Add Mock Data.

The app will automatically generate a random set of restaurants objects, then call your addRestaurant function. However, you won't yet see the data in your actual web app because we still need to implement retrieving the data (the next section of the codelab).

If you navigate to the Cloud Firestore tab in the Firebase console, though, you should now see new documents in the restaurants collection!


![f06898b9d6dd4881.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/25071/cff76203-d553-b523-5f01-7e129f792c2e.png)

Congratulations, you have just written data to Cloud Firestore from a web app!

In the next section, you'll learn how to retrieve data from Cloud Firestore and display it in your app.


# 7. Display data from Cloud Firestore
In this section, you'll learn how to retrieve data from Cloud Firestore and display it in your app. The two key steps are creating a query and adding a snapshot listener. This listener will be notified of all existing data that matches the query and will receive updates in real time.

First, let's construct the query that will serve the default, unfiltered list of restaurants.

1. Go back to the file src/FriendlyEats/FriendlyEats.Data.js.
1. Find the function getAllRestaurants.
1. Replace the entire function with the following code.


[FriendlyEats.Data.js](https://github.com/isamu/FriendlyEats-React/blob/master/src/FriendlyEats/FriendlyEats.Data.js#L10-L14.js)

```
export const getAllRestaurants = () => {
  const query = firebase.firestore()
        .collection('restaurants')
        .orderBy('avgRating', 'desc')
        .limit(50);

  return query;
};
```

In the code above, we construct a query which will retrieve up to 50 restaurants from the top-level collection named restaurants, which are ordered by the average rating (currently all zero). After we declared this query, we pass it to the getDocumentsInQuery() method which is responsible for loading and rendering the data.

We'll do this by adding a snapshot listener.

- Go back to the file src/FriendlyEats/FriendlyEats.Data.js.
- Find the function getDocumentsInQuery.
- Replace the entire function with the following code.

[FriendlyEats.Data.js](https://github.com/isamu/FriendlyEats-React/blob/master/src/FriendlyEats/FriendlyEats.Data.js#L16-L20.js)

```
export const getDocumentsInQuery = (query, renderer) => {
  return query.onSnapshot((snapshot) => {
    if (!snapshot.size) return renderer.empty();

    snapshot.docChanges().forEach((change) => {
      if (change.type === 'removed') {
        renderer.remove(change.doc)
      } else {
        renderer.display(change.doc)
      }
    });
  });
};
```
In the code above, query.onSnapshot will trigger its callback every time there's a change to the result of the query.

- The first time, the callback is triggered with the entire result set of the query -- meaning the whole restaurants collection from Cloud Firestore. It then passes all the individual documents to the renderer.display function.
- When a document is deleted, change.type equals to removed. So in this case, we'll call a function that removes the restaurant from the UI.

Now that we've implemented both methods, refresh the app and verify that the restaurants we saw earlier in the Firebase console are now visible in the app. If you completed this section successfully, then your app is now reading and writing data with Cloud Firestore!

As your list of restaurants changes, this listener will keep updating automatically. Try going to the Firebase console and manually deleting a restaurant or changing its name - you'll see the changes show up on your site immediately!

Note: It's also possible to fetch documents from Cloud Firestore once, rather than listening for real time updates using the Query.get() method.

> # <img width="715" alt="sample.jpg" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/25071/2617ae53-c393-f062-e018-410a9f23f8ed.jpeg">

# 8. Get() data
So far, we've shown how to use onSnapshot to retrieve updates in real time; however, that's not always what we want. Sometimes it makes more sense to only fetch the data once.

We'll want to implement a method that's triggered when a user clicks into a specific restaurant in your app.

1. Go back to your file src/FriendlyEats/FriendlyEats.Data.js.
1. Find the function getRestaurant.
1. Replace the entire function with the following code.

[FriendlyEats.Data.js](https://github.com/isamu/FriendlyEats-React/blob/master/src/FriendlyEats/FriendlyEats.Data.js#L22-L26.js)

```
export const getRestaurant = (id) => {
  return firebase.firestore().collection('restaurants').doc(id).get();
};
```
After you've implemented this method, you'll be able to view pages for each restaurant. Just click on a restaurant in the list and you should see the restaurant's details page:

<img width="549" alt="スクリーンショット 2019-08-03 4.32.01.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/25071/3c2a3b4d-1da8-4cff-f9b2-e44ee0e305f9.png">


For now, you can't add ratings as we still need to implement adding ratings later on in the codelab.


# 9. Sort and filter data
Currently, our app displays a list of restaurants, but there's no way for the user to filter based on their needs. In this section, you'll use Cloud Firestore's advanced querying to enable filtering.

Here's an example of a simple query to fetch all Dim Sum restaurants:

```
var filteredQuery = query.where('category', '==', 'Dim Sum')
```
As its name implies, the where() method will make our query download only members of the collection whose fields meet the restrictions we set. In this case, it'll only download restaurants where category is Dim Sum.

In our app, the user can chain multiple filters to create specific queries, like "Pizza in San Francisco" or "Seafood in Los Angeles ordered by Popularity".

We'll create a method that builds up a query which will filter our restaurants based on multiple criteria selected by our users.

1. Go back to your file src/FriendlyEats/FriendlyEats.Data.js.
1. Find the function getFilteredRestaurants.
1. Replace the entire function with the following code.

[FriendlyEats.Data.js](https://github.com/isamu/FriendlyEats-React/blob/master/src/FriendlyEats/FriendlyEats.Data.js#L28-L32.js)

```
export const getFilteredRestaurants = (filters) => {
  let query = firebase.firestore().collection('restaurants');

  if (filters.category !== 'Any') {
    query = query.where('category', '==', filters.category);
  }

  if (filters.city !== 'Any') {
    query = query.where('city', '==', filters.city);
  }

  if (filters.price !== 'Any') {
    query = query.where('price', '==', filters.price.length);
  }

  if (filters.sort === 'Rating') {
    query = query.orderBy('avgRating', 'desc');
  } else if (filters.sort === 'Reviews') {
    query = query.orderBy('numRatings', 'desc');
  }
  return query;
};
```

The code above adds multiple where filters and a single orderBy clause to build a compound query based on user input. Our query will now only return restaurants that match the user's requirements.

Refresh your FriendlyEats app in your browser, then verify that you can filter by price, city, and category. While testing, you'll see errors in the JavaScript Console of your browser that look like this:

```
The query requires an index. You can create it here: https://console.firebase.google.com/project/.../database/firestore/indexes?create_index=...
```

These errors are because Cloud Firestore requires indexes for most compound queries. Requiring indexes on queries keeps Cloud Firestore fast at scale.

Opening the link from the error message will automatically open the index creation UI in the Firebase console with the correct parameters filled in. In the next section, we'll write and deploy the indexes needed for this application.

# 10. Deploy indexes
If we don't want to explore every path in our app and follow each of the index creation links, we can easily deploy many indexes at once using the Firebase CLI.

1. In your app's downloaded local directory, you'll find a firestore.indexes.json file.

This file describes all the indexes needed for all the possible combinations of filters.

[firestore.indexes.json](https://github.com/firebase/friendlyeats-web/blob/master/firestore.indexes.json)

```
{
 "indexes": [
   {
     "collectionGroup": "restaurants",
     "queryScope": "COLLECTION",
     "fields": [
       { "fieldPath": "city", "order": "ASCENDING" },
       { "fieldPath": "avgRating", "order": "DESCENDING" }
     ]
   },

   ...

 ]
}
```

Deploy these indexes with the following command:

```
firebase deploy --only firestore:indexes
```
After a few minutes, your indexes will be live and the error messages will go away.

> Tip: To learn more about indexes in Cloud Firestore, visit the documentation.

# 11. Write data in a transaction
In this section, we'll add the ability for users to submit reviews to restaurants. So far, all of our writes have been atomic and relatively simple. If any of them errored, we'd likely just prompt the user to retry them or our app would retry the write automatically.

Our app will have many users who want to add a rating for a restaurant, so we'll need to coordinate multiple reads and writes. First the review itself has to be submitted, then the restaurant's rating count and average rating need to be updated. If one of these fails but not the other, we're left in an inconsistent state where the data in one part of our database doesn't match the data in another.

Fortunately, Cloud Firestore provides transaction functionality that allows us to perform multiple reads and writes in a single atomic operation, ensuring that our data remains consistent.

1. Go back to your file src/FriendlyEats/FriendlyEats.Data.js.
1. Find the function addRating.
1. Replace the entire function with the following code.

[FriendlyEats.Data.js](https://github.com/isamu/FriendlyEats-React/blob/master/src/FriendlyEats/FriendlyEats.Data.js#L34-L38.js)

```
export const addRating = (restaurantID, rating) => {
  const collection = firebase.firestore().collection('restaurants');
  const document = collection.doc(restaurantID);
  const newRatingDocument = document.collection('ratings').doc();

  return firebase.firestore().runTransaction(function(transaction) {
    return transaction.get(document).then(function(doc) {
      const data = doc.data();

      const newAverage =
            (data.numRatings * data.avgRating + rating.rating) /
            (data.numRatings + 1);

      transaction.update(document, {
        numRatings: data.numRatings + 1,
        avgRating: newAverage
      });
      return transaction.set(newRatingDocument, rating);
    });
  });
};
```

In the block above, we trigger a transaction to update the numeric values of averageRating and ratingCount in the restaurant document. At the same time, we add the new rating to the ratings subcollection.

> Note: Adding ratings is a good example for using a transaction for this particular codelab. However, in a production app you should perform the average rating calculation on a trusted server to avoid manipulation by users. A good way to do this is to write the rating document directly from the client, then use Cloud Functions to update the new restaurant average rating.

> Warning: When a transaction fails on the server, the callback is also re-executed repeatedly. Never place logic that modifies app state inside the transaction callback.


# 12. Secure your data
At the beginning of this codelab, we set our app's security rules to completely open the database to any read or write. In a real application, we'd want to set much more fine-grained rules to prevent undesirable data access or modification.

In the Firebase console's Develop section, click Database.
Click the Rules tab in the Cloud Firestore section (or click here to go directly there).
Replace the defaults with the following rules, then click Publish.

[firestore.rules](https://github.com/isamu/FriendlyEats-React/blob/master/firestore.rules)

```
service cloud.firestore {
  match /databases/{database}/documents {

        // Restaurants:
        //   - Authenticated user can read
        //   - Authenticated user can create/update (for demo)
        //   - Validate updates
        //   - Deletes are not allowed
    match /restaurants/{restaurantId} {
      allow read, create: if request.auth != null;
      allow update: if request.auth != null
                    && request.resource.data.name == resource.data.name
      allow delete: if false;
      
      // Ratings:
      //   - Authenticated user can read
      //   - Authenticated user can create if userId matches
      //   - Deletes and updates are not allowed
      match /ratings/{ratingId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null
                      && request.resource.data.userId == request.auth.uid;
        allow update, delete: if false;
        
        }
    }
  }
}
```

These rules restrict access to ensure that clients only make safe changes. For example:

- Updates to a restaurant document can only change the ratings, not the name or any other immutable data.
- Ratings can only be created if the user ID matches the signed-in user, which prevents spoofing.
 
Alternatively to using the Firebase console, you can use the Firebase CLI to deploy rules to your Firebase project. The firestore.rules file in your working directory already contains the rules from above. To deploy these rules from your local filesystem (rather than using the Firebase console), you'd run the following command:


```
firebase deploy --only firestore:rules
```

Important: To learn more about security rules, have a look at the security rules documentation.

# 13. Conclusion
In this codelab, you learned how to perform basic and advanced reads and writes with Cloud Firestore, as well as how to secure data access with security rules. You can find the full solution in the [quickstarts-js](https://github.com/firebase/quickstart-js/tree/master/firestore) repository.

To learn more about Cloud Firestore, visit the following resources:

- [Introduction to Cloud Firestore](https://firebase.google.com/docs/firestore/)
- [Choosing a Data Structure](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [Cloud Firestore Web Samples](https://firebase.google.com/docs/firestore/client/samples-web)
