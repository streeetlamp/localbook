# Bread Pudding

Loosely based of @jpweller's boilerplate.

## How To: 
```bash
bundle install
npm install
grunt compass
grunt watch
grunt sync
```

Work in the `app` directory. 
When ready for production use the prod task.

```bash
grunt prod
```

It will create a new `build` directory that is ready for deploment.

## Known Issues

If grunt-contrib-imagmin fails to install properly because of pngquant see [issue](https://github.com/gruntjs/grunt-contrib-imagemin/issues/183/#issuecomment-41841391)


```
                 ____
     .----------'    '-.
    /  .      '     .   \\ *
   /        '    .      /|
  /      .             \ /
 /  ' .       .     .  || |
/.___________    '    / //
|._          '------'| /|
'.............______.-' /  
|-.                  | /
`"""""""""""""-.....-'    *pudding
```