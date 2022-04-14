## Project 1 for Udacity Full Stack Javascript Developer Course

#### Description

This is my work on the Udacity Full Stack Developer Course for Project 1. It's functionality is basic, and allows a user to start the Express server, drop files into a specified folder, and navigate to an address to do the resize of the given image.

#### Initializing the project

Run the command **npm init** in the root of the project folder to initialize the npm project.

#### Built in Scripts

The following scripts are available to run with the command **npm run** ***script name***

| Script Name | Description |
| ----------- | ----------- |
| **prettier** | Runs the prettier node application to format the code |
| **lint** | Runs ESLint to check for code issues |
| **test** | Runs all Test Specs |
| **build** | Builds the Typescript application |
| **buildandrun** | Builds the Typescript application and runs the Express server. Application is ready to accept images. |
| **jasmine** | Runs the Test Specs without first building the application |

#### How to use the project

The very first thing is to create the folder structure for the assets. In */projectroot/dist/assets/full*, where *projectroot* is the root of the project on your filesystem, create the *assets* folder. Inside this folder, create two folders: *full* and *resized*.

The bare minimum to start the project is to run **npm run buildandrun** to start the application and have it be ready for input.

Open the project folder and navigate to */projectroot/dist/assets/full*. Drop any images you want to resize into this folder.

In your web browser, in your address bar, place the following URL in the address bar: *http://localhost:3000/api/imagemanip?filename={1}&width={2}&height={3}*

The placeholders 1, 2, and 3 are replaced with the following
{1} - The filename. This much match the filename in the */projectroot/dist/assets/full* folder. There should be no paths attached to this filename.
{2} - The width of the resized image. This must be non-negative, and not a zero. This must also be numeric with no alpha characters.
{3} - The width of the resized image. This must be non-negative, and not a zero. This must also be numeric with no alpha characters.

When an image is not cached, it is resized and copied into the */projectroot/dist/assets/resized* folder. If the same image with the same dimensions is called up again, the cached copy of this file is retrieved and sent to the browser.