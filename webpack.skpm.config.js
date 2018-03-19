/**
 * @Author: summer1024
 * @Date: 2018-03-06
 * @Project: my-plugin
 */
module.exports = function(config) {
    config.resolve.extensions = [".sketch.js", ".js", ".vue", ".css"]
    config.resolve.alias = {
        'vue$': 'vue/dist/vue.esm.js',
        'muse-components': 'muse-ui/src'
    }
    config.module.rules.push({
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
            loaders: {
                less: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'less-loader'
                    }
                ],
                css: [
                    'vue-style-loader',
                    'css-loader',
                ]
            }
        }
    });
    config.module.rules.push({
      test: /\.(html)$/,
      use: [
        {
          loader: "@skpm/extract-loader",
        },
        {
          loader: "html-loader",
          options: {
            attrs: ["img:src", "link:href"],
            interpolate: true,
          },
        },
      ],
    })
    config.module.rules.push({
      test: /\.(css)$/,
      loader: 'style-loader!css-loader'
    })
    config.module.rules.push({
        test: /\.less$/,
        loader: "style-loader!css-loader!less-loader",
    })
    config.module.rules.push({
        test: /muse-ui.src.*?js$/,
        loader: 'babel-loader'
    })
    config.module.rules.push({
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
            'file-loader',
            {
                loader: 'image-webpack-loader',
                options: {
                    bypassOnDebug: true,
                }
            }
        ]
    })
  }
  