export default function getHW(data, list, that){
    let heightDate = [0, 0];//接收累计高度的容器数组
    let rightData = []//渲染右侧盒子的数组
    let leftData = []//渲染左侧盒子的数组

    function loadImg(item) {
        const promise = new Promise(function(resolve, reject) {
            if (item.videoUrl) {
                var video = document.createElement('video')
                // document.body.appendChild(video);
                video.src = require('@/' + item.album[0].url);
                video.oncanplay = function () {
                    resolve({width: this.offsetWidth, height: this.offsetHeight});
                    // this.src = 'about:blank';
                    // document.body.removeChild(video);
                }
                video.onerror = function() {
                    reject();
                }
            } else {
                var img = new Image();
                if (list === 'recipesList') {
                    img.src = require('@/' + item.album[0].url);
                } else {
                    img.src = require('@/' + item.imgs[0].url);
                }
                img.onload = function() {
                    resolve(img);
                }
                img.onerror = function() {
                    reject();
                }
            }
        })

        // return new Promise((resolve, reject) => {
        //     var video = document.createElement('video')
        //     video.oncanplay = function () {
        //       resolve({width: this.offsetWidth, height: this.offsetHeight})
        //       this.src = 'about:blank'
        //       document.body.removeChild(video)
        //     }
    
        //     document.body.appendChild(video)
        //     video.src = url
        //   })
          
        return promise
    }
    async function test(item) {
        await loadImg(item).then(function(img) {
            let height = img.height;
            let minNum = Math.min.apply(null, heightDate)// 从heighetData筛选最小项
            let minIndex = heightDate.indexOf(minNum);// 获取 最小项的小标 准备开始进行累加
            heightDate[minIndex] = heightDate[minIndex] + height;//从 heightData 中找到最小的项后进行累加， 
            if(minIndex===0){//[0]加到left [1]加到 right
                leftData.push(item)
            }else{
                rightData.push(item)
            }
        }, function() {
            console.log('failed')
        })
        that.setState({ leftData, rightData });
        // if (list === 'recipesList') {
        //     that.props.saveLeftData(leftData);
        //     that.props.saveRightData(rightData);
        // } else if (list === 'dynamicList'){
        //     that.props.saveLeftDynamic(leftData);
        //     that.props.saveRightDynamic(rightData);
        // } else if (list === 'likeDynamicList'){
        //     that.props.saveLikeLeftDynamic(leftData);
        //     that.props.saveLikeRightDynamic(rightData);
        // }
    }
    data.forEach(item => {
        test(item);
    })
}