# Blogger
This is a basic Blogger clone to create a blog with comments.

# Getting started

- clone the repo: `git clone git@github.com:niki4810/Blogger.git`
- If not alerady installed, install [Node](http://nodejs.org).
- Install `babel`: `npm install -g babel`
- Install `nodemon`: `npm install -g nodemon`
- If not alerady installed, install and run [MongoDB](http://docs.mongodb.org/manual/installation/).
- run `npm install` from the root.
- run `npm start` to start the server
- navigate to [127.0.0.1:8000](http://127.0.0.1:8000/) to access the website.

#Features:

### User can Signup, Login and Logout with input validation

![alt tag](https://raw.githubusercontent.com/niki4810/Blogger/master/images/step1-signup-login-logout.gif)

### Session and user accounts are persisted in a data store
- All the data is stored into mongodb database. As we can see below when we restart out server, out previously registered users are still persisted.

![alt tag](https://raw.githubusercontent.com/niki4810/Blogger/master/images/step2-persistent.gif)

### User can create and edit a blog post

![alt tag](https://raw.githubusercontent.com/niki4810/Blogger/master/images/step3-create-edit-blog-post.gif)

### User can view blog posts with details on their Profile

![alt tag](https://raw.githubusercontent.com/niki4810/Blogger/master/images/step4-view-posts-on-profile.gif)

### User can comments on their blog posts on their Profile

![alt tag](https://raw.githubusercontent.com/niki4810/Blogger/master/images/step5-user-can-comment-on-profile.gif)

### User can view a anyone's blog with posts and comments at the specified url & Logged In users can comment on any blog post

![alt tag](https://raw.githubusercontent.com/niki4810/Blogger/master/images/step6-users-can-view-other-blogs.gif)

