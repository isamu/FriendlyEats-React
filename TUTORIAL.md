# 1. FriendlyEats-React について

FriendlyEats-Reactは、Reactを使ったFirebase / Firestoreのチュートリアル用のアプリです。Firestoreを学習するために最小限のプログラムをするだけでFirestoreを使ったアプリケーションを作ることができます。
<img width="715" alt="sample.jpg" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/25071/35cbad6f-5aa6-25aa-27db-dc9a3be00b75.jpeg">

このチュートリアルでは以下のことを学習します。
- WebアプリケーションからCloud Firestoreへの読み書きをする
- リアルタイムにCloud Firestoreのデータの変更を受け取る
- Firebaseのユーザ認証を使ったり、security rulesを使ってCloud Firestoreのデータを安全に読み書きする
- Cloud Firestoreの複雑なクエリーを書く

このチュートリアルを始めるに当たって、必要な開発環境は以下となります。

- Gitクライアント。GitHubのアカウントもあれば用意してください。
- Node.jsとnpm - Nodeはversion 8をお薦めします。
- IDEやテキストエディタ。どんなものでの良いですが、Emacs, vim, WebStorm, Atom, VS Code, Sublime などです。


# 2. Firebase projectの作成と設定

### Firebase projectを作成
1. Firebaseのコンソール上で, Add project をクリックし、Firebase projectの名前をFriendlyEatsと入力してください.
作成されたあなたの Firebase projectのProject IDは忘れないように！
1. Create projectをクリック！

> 重要: 作成された Firebase project はFriendlyEats という名前ですが、Firebaseは自動的に friendlyeats-1234のような固有のProject IDを割り当てます。この固有のIDは、あなたのプロジェクトを識別するのに必要です。(CLIなどで）。FriendlyEats は単にプロジェクトの名前です。

これから作成するアプリケーションは、web上でいくつかのFirebaseのサービスを利用します。

- Firebase Authentication - ユーザを簡単に管理/識別します
- Cloud Firestore - クラウド上に構造化されたデータを保存して、データが更新された時に即座に通知されます。
- Firebase Hosting - 静的なコンテンツを配信します

このチュートリアルでは、Firebase AuthおよびCloud Firestoreについては、Firebaseコンソールを使用してサービスの設定と有効化を順を追って説明します。

### Anonymous Auth (匿名認証)を有効にする

認証はこのチュートリアルの焦点ではありませんが、何らかの形式の認証を使用することは重要です。
このアプリでは、匿名ログインを使用します。つまり、ユーザーは何も意識することなくサイレントサインインします。
 
その為に、匿名ログインを有効にする必要があります。

1. Firebase consoleにおいて、左のナビゲーションメニューにDevelopのセクションがあります
1. Click Authenticationをクリックして、Sign-in method のタブをクリックします.
1. Anonymous Sign-in を有効にして保存(Save)をクリックします

![fee6c3ebdf904459.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/25071/9c268b6e-a018-0566-8d49-0e8e2e76fe5f.png)

これでユーザーがWebアプリにアクセスするときに、サイレントサインインできるようになりました。詳細は、匿名認証のドキュメントをお読みください
 
### Cloud Firestoreを有効にする
このアプリは、レストランの情報や評価を保存、更新情報を受け取る為に、Cloud Firestoreを使います.

その為に、Cloud Firestoreを有効にする必要があります

1. Firebase consoleのDevelopセクションで, Databaseをクリックします.
1. Cloud Firestoreペインで「データベースを作成」をクリックします。
![8c5f57293d48652.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/25071/4b85b657-394d-60ea-46f0-6e97615342f6.png)
1. オプションの「テストモードで開始する」を選択し、セキュリティルールに関する免責事項を読んだ後、「有効にする」をクリックします。

テストモードでは、開発中にデータベースに自由に書き込むことができます。このチュートリアルでは、後半にデータベース(Firestore)のセキュリティを強化します。

![620b95f93bdb154a.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/25071/63f6c46d-a2fd-a149-4224-c408ec3e8b2f.png)


# 3. サンプルのソースコード取得とインストール

### ソースコードの取得
Clone the GitHub repository from the command line:

```
git clone https://github.com/isamu/FriendlyEats-React
```
* 自分の変更をGitHubで管理したい場合には、Forkしてcloneしてください


サンプルコードは📁FriendlyEats-ReactディレクトリにCloneする必要があります。
以後、このディレクトリ内でコマンドラインを実行してください。


```
cd FriendlyEats-React
```

### npmのインストール

npmのパッケージをインストールします。

```
npm install
```
### Firebase の設定取得と書き換え

Firebaseの設定をコンソールから取得して、src/config.js に設定をコピーします。

- firebase console (from https://firebase.google.com) を開いてprojectを追加.
- このプロジェクトのダッシュボードで「add app」をクリック、 "web" (</>)を選択.
- このアプリの設定画面のGeneralタブの Firebase SDK snippetに置いて"Config" を選択
- `const firebase` で始まる設定をコピーして、ソースコードのsrc/config.jsにコピーする.  

### スターターアプリをインポートする

IDE（WebStorm、Atom、Sublime、Visual Studio Code ...）を使用している場合、📁FriendlyEats-Reactディレクトリを開くかインポートします。このディレクトリには、これから実装するレストラン情報と、オススメ情報を表示するアプリのチュートリアルのモックコードが含まれています。このチュートリアルを機能するように、そのディレクトリのコードを実装していく必要があります。


# 4. Firebase CLI (コマンドラインツール)のインストール

The Firebase Command Line Interface (CLI) allows you to serve your web app locally and deploy your web app to Firebase Hosting.


Firebaseコマンドラインインターフェイス（CLI）を使用すると、Webアプリをローカルで開発したり、Firebase Hostingにデプロイすることができます。

Note: CLIをインストールするには、通常NodeJSに付属しているnpmをインストールする必要があります。

1 . 次のnpmコマンドを実行して、CLIをインストールします。

```
npm -g install firebase-tools
```

> 動作しませんか？ npmのpermissionを変更する必要がある場合があります。

2 . 次のコマンドを実行して、CLIが正しくインストールされたことを確認します。

```
firebase --version
```

Firebase CLIのバージョンがv6.2.0以降であることを確認してください。

3 . 次のコマンドを実行して、Firebase CLIを認証します。

```
firebase login
```

Firebase Hostingのアプリの設定をアプリのローカルディレクトリとファイルから取得するように、ウェブアプリテンプレートを設定しました。ただし、これを行うには、アプリをFirebaseプロジェクトに関連付ける必要があります。


4 . コマンドラインが、先ほどcloneしたディレクトリーになっているか確認してください（通常FriendlyEats-Reactディレクトリー。pwdで現在のディレクトリーを確認できます）

5 . 次のコマンドを実行して、アプリをFirebaseプロジェクトに関連付けます。

```
firebase use --add
```

6 . プロンプトが表示されたら、プロジェクトIDを選択し、Firebaseプロジェクトにエイリアスを指定します。
エイリアスは、複数の環境（本番、ステージングなど）がある場合に役立ちます。ただし、このチュートリアルでは、デフォルトのエイリアスのみを使用します。

7 . コマンドラインの残りの指示に従ってください。

# 5. Reactをローカルで起動する
アプリで実際に作業を開始する準備ができました！アプリをローカルで実行しましょう！

1 . 次のコマンドをローカルのCLIで実行します:

```
npm run serve
```

2 . 成功すると次の文を含むメッセージが表示されます

```
  - Local:   http://localhost:8080/ 
```

Reactサーバがローカルで起動しています。 ブラウザ http://localhost:8080 を開くとサンプルアプリを見ることができます。 Reactを起動すると自動的に開く場合もあります。8080という数字は少し別の番号になっている場合もあります。

3 . ブラウザで http://localhost:8080 を見る

クラウド上のFirebaseプロジェクトに接続されているFriendlyEatsアプリが表示されます。

アプリは自動的にクラウド上のFirebaseプロジェクトに接続し、匿名ユーザーとしてサインインしました。

<img width="771" alt="スクリーンショット 2019-08-03 4.28.16.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/25071/e20ecc4f-34a1-9044-f0f9-73913dff3a43.png">


# 6. Cloud Firestoreへデータの書き込み

このセクションでは、Cloud Firestoreにデータを書き込みます。Firebaseコンソール上で手動でデータ入力を行うこともできますが、Cloud Firestoreの基本的な書き込みを学習する為に、アプリ自体でデータ生成/入力を行います。


### データモデル

Firestoreデータは、コレクション、ドキュメント、フィールド、およびサブコレクションで構成されています。各レストラン情報をドキュメントとして、restaurantと呼ばれる最上位のコレクションに保存します。

![6010184d388a897.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/25071/d45258ad-7389-7cc4-60ec-98f218f1a9a5.png)


そして、各レストランのレビューをratingと名付けたサブコレクションに保存します。

![7d949c3471e49573.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/25071/a94dc013-8ea3-8b84-a074-a730ad75da76.png)


> Tip: Firestoreデータモデルの詳細については、ドキュメントのドキュメントとコレクションをご覧ください。

### Firestoreにレストラン情報を追加する

このアプリの主なモデルオブジェクトはrestaurantです。restaurantsコレクションにレストランのドキュメントを追加するコードを書きましょう。

1. cloneしたソースコードの src/FriendlyEats/FriendlyEats.Data.js ファイルを開く.
1. addRestaurant 関数を探す.
1. 関数全体を以下のコードに置き換える

[FriendlyEats.Data.js](https://github.com/isamu/FriendlyEats-React/blob/master/src/FriendlyEats/FriendlyEats.Data.js#L4-L8.js)

```
export const addRestaurant = (data) => {
  const collection = firebase.firestore().collection('restaurants');
  return collection.add(data);
};
```

上記のコードにより、restaurantsコレクションに新しいドキュメント(データ)が追加されます。ドキュメントのデータはJavaScriptオブジェクトです。

1. まずこの関数はレストランのデータを引数として取得し、
1. 次にCloud Firestoreのrestaurantsコレクションへの参照を取得
1. 最後にデータを追加

という処理をします。

(* 実際にどのようにデータが生成されるか興味がある人はsrc/FriendlyEats/FriendlyEats.Mock.js のaddMockRestaurantsとgetRandomRestaurantの関数を見てください。)

### restaurants情報を追加しよう!

1. ブラウザのFriendlyEatsアプリに戻り、画面を更新しましょう
1. 「Add Mock Data」をクリック.

アプリはレストランオブジェクトをランダムに自動生成し、addRestaurant関数を呼び出します。
ただし、データの取得（このチュートリアルの次のセクション）を実装する必要があるため、実際のWebアプリにはまだデータは表示されません。

ただし、Firebaseコンソールの「Cloud Firestore」タブに移動すると、restaurantsコレクションに新しいドキュメントが表示されます。

![f06898b9d6dd4881.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/25071/cff76203-d553-b523-5f01-7e129f792c2e.png)


おめでとうございます！！WebアプリからCloud Firestoreにデータを書き込みが成功しました！！


次のセクションでは、Cloud Firestoreからデータを取得してアプリに表示する方法を学習します。


# 7. Cloud Firestore のデータを表示


このセクションでは、Cloud Firestoreからデータを取得してアプリに表示する方法を学習します。 2つの重要な手順は、クエリの作成とスナップショットリスナーの追加です。このリスナーには、クエリに一致するすべての既存データが通知され、更新をリアルタイムで受信します。

最初に、レストランのデフォルトのフィルタリングされていないリストを提供するクエリを作成しましょう。

1. src/FriendlyEats/FriendlyEats.Data.js ファイルを開きます
1. getAllRestaurants 関数を探します
1. 関数全体を以下のコードに置き換えます


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

上記のコードでは、restaurantsという名のトップレベルコレクションから最大50件のレストランを取得するクエリを作成しています。これらは評価の平均順（現在はすべてゼロ）に並べられています。このクエリを定義後、データの読み込みとレンダリングを行うgetDocumentsInQuery（）関数にこのクエリを渡します.

これを行うには、スナップショットリスナーを追加します。


- src/FriendlyEats/FriendlyEats.Data.js を開く
- getDocumentsInQuery 関数を探す
- 関数全体を以下のコードに置き換える

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

上記のコードでは、クエリの結果に変更があるたびにquery.onSnapshotをコールバックで呼び出します。

- 最初のコールバックは、クエリの結果、全体のデータをsnapshotとして渡します。これは、Cloud Firestoreのrestaurantsコレクション全体(50件)を意味します。そしてchangeには、全ての個々のドキュメントが渡され、それをrenderer.display関数に渡します。
- ドキュメントが削除された時には、change.typeはremovedとなります。したがって、この場合、UIからレストランを削除する関数を呼び出します。

両方のメソッドを実装したので、アプリを更新し、Firebaseコンソールで前に表示したレストラン情報がWebアプリに表示されていることを確認します。このセクションを正常に完了した場合、WebアプリはCloud Firestoreでデータを読み書きできています。

レストランのリストが変更されると、このリスナーは自動的にデータを更新します。
Firebaseコンソールに移動して、レストランを手動で削除するか、名前を変更してみてください。サイト上のデータも更新されます。


Note: リアルタイムの更新をリッスンするのではなく、Query.get（）メソッドを使用してCloud Firestoreからドキュメントを一度だけ取得することもできます。

> # <img width="715" alt="sample.jpg" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/25071/2617ae53-c393-f062-e018-410a9f23f8ed.jpeg">

# 8. データを取得する
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


# 9. データのソートと絞り込み
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

# 10. Cloud Firestoreへindexの追加

If we don't want to explore every path in our app and follow each of the index creation links, we can easily deploy many indexes at once using the Firebase CLI.

1. In your app's downloaded local directory, you'll find a firestore.indexes.json file.

This file describes all the indexes needed for all the possible combinations of filters.

[firestore.indexes.json](https://github.com/isamu/FriendlyEats-React/blob/master/firestore.indexes.json)

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

# 11. トランザクションを使ってデータの書き込み
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


# 12. データを守る
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

# 13. デプロイ

Reactをビルドします

```
npm run build
```

build/以下に静的なファイルが生成されます。

Cloud Firebaseへデプロイします。

```
firebase deploy --only hosting
```

以下のように表示されるとデプロイ成功です。
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/friendlyeats-react/overview
Hosting URL: https://friendlyeats-react.firebaseapp.com
```

Hosting URLをブラウザで見てみましょう。作成したアプリケーションが見えます！

# 14. まとめ
In this codelab, you learned how to perform basic and advanced reads and writes with Cloud Firestore, as well as how to secure data access with security rules. You can find the full solution in the [quickstarts-js](https://github.com/firebase/quickstart-js/tree/master/firestore) repository.

To learn more about Cloud Firestore, visit the following resources:

- [Introduction to Cloud Firestore](https://firebase.google.com/docs/firestore/)
- [Choosing a Data Structure](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [Cloud Firestore Web Samples](https://firebase.google.com/docs/firestore/client/samples-web)
