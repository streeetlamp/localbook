# Bread Pudding

A heavy modification of @jpweller's boilerplate.

### known issues

If grunt-contrib-imagmin fails to install properly because of pngquant see [issue](https://github.com/gruntjs/grunt-contrib-imagemin/issues/183/#issuecomment-41841391)

If still no luck then use the copy task (uncomment and set it up proper first) to dupe from dev to prod. No optimization occurs in this scenario.

I had the copy task set up when I went for a last gasp attempt on imagemin and voilá it worked. Meh.