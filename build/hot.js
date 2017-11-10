"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const handlerMap = {};
const cacheMap = {};
/**
 * 加载文件内的代码并监视更新热加载
 *	[@return](/user/return) {Promise.<void>}
 */
const loadHandlers = async function () {
    /// 查看指定文件夹下的所有文件
    const files = await new Promise((resolve, reject) => {
        fs.readdir(path.join(__dirname, 'hots'), function (err, files) {
            if (err) {
                reject(err);
            }
            else {
                resolve(files);
            }
        });
    });
    /// 遍历加载文件
    for (let f in files) {
        if (/.*?\.js$/.test(files[f])) {
            handlerMap[files[f]] = await loadHandler(path.join(__dirname, 'hots', files[f]));
        }
    }
    /// 监视文件变动
    watchHandlers();
};
/**
 * 监视文件变动
 */
const watchHandlers = function () {
    console.log('watching ', path.join(__dirname, 'hots'));
    fs.watch(path.join(__dirname, 'hots'), {
        recursive: true
    }, function (eventType, filename) {
        if (/.*?\.js$/.test(filename)) {
            /// 这里先删除旧的缓存代码 防止内存泄漏
            if (cacheMap[require.resolve(path.join(__dirname, 'hots', filename))])
                delete cacheMap[require.resolve(path.join(__dirname, 'hots', filename))];
            /// 这里缓存现在运行的代码,热加载失败后恢复用,还有就是防止现有运行的代码异步没有返回就删除会因为逻辑可能没有执行完毕引起逻辑bug
            cacheMap[require.resolve(path.join(__dirname, 'hots', filename))] = require.cache[require.resolve(path.join(__dirname, 'hots', filename))];
            ///重置require.cache缓存
            require.cache[require.resolve(path.join(__dirname, 'hots', filename))] = null;
            loadHandler(path.join(__dirname, 'hots', filename)).then(function (data) {
                if (data) {
                    handlerMap[filename] = data;
                }
                else {
                    delete handlerMap[filename];
                }
                console.log("热更成功", filename, "当前代码", handlerMap);
            }).catch(function (err) {
                console.log("热更失败: 代码包含以下错误:", err, "当前代码:", handlerMap);
                require.cache[require.resolve(path.join(__dirname, 'hots', filename))] = cacheMap[require.resolve(path.join(__dirname, 'hots', filename))];
                cacheMap[require.resolve(path.join(__dirname, 'hots', filename))] = null;
            });
        }
    });
};
/**
 * 加载文件
 * [@param](/user/param) filename
 * [@return](/user/return) {Promise.<*>}
 */
const loadHandler = async function (filename) {
    const exists = await new Promise(resolve => {
        /// 查看代码文件是否存在
        fs.access(filename, fs.constants.F_OK | fs.constants.R_OK, err => {
            if (err) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        });
    });
    if (exists) {
        return await new Promise((resolve, reject) => {
            fs.readFile(filename, function (err, data) {
                if (err) {
                    resolve(null);
                }
                else {
                    try {
                        /// 使用vm script编译热加载的代码
                        new vm.Script(data);
                        //const script = new vm.Script(data);
                        // const context = new vm.createContext({
                        //     require: require,
                        //     module: {}
                        // });
                        // script.runInContext(context);
                    }
                    catch (e) {
                        /// 语法错误,编译失败
                        reject(e);
                        return;
                    }
                    /// 编译成功的代码
                    resolve(require(filename));
                }
            });
        });
    }
    else {
        /// 文件被删除
        return null;
    }
};
loadHandlers().then(function () {
    console.log("run...");
}).catch(function (e) {
    console.error(e);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG90LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2hvdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFHekIsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUVwQjs7O0dBR0c7QUFDSCxNQUFNLFlBQVksR0FBRyxLQUFLO0lBQ3pCLGlCQUFpQjtJQUNqQixNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU07UUFDL0MsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsRUFBRSxVQUFVLEdBQUcsRUFBRSxLQUFLO1lBQzVELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNQLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQixDQUFDO1FBQ0YsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUNILFVBQVU7SUFDVixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRixDQUFDO0lBQ0YsQ0FBQztJQUNELFVBQVU7SUFDVixhQUFhLEVBQUUsQ0FBQztBQUNqQixDQUFDLENBQUM7QUFFRjs7R0FFRztBQUNILE1BQU0sYUFBYSxHQUFHO0lBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDdkQsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsRUFBRTtRQUN0QyxTQUFTLEVBQUUsSUFBSTtLQUNmLEVBQUUsVUFBVSxTQUFTLEVBQUUsUUFBUTtRQUMvQixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixzQkFBc0I7WUFDdEIsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckUsT0FBTyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFFLG9FQUFvRTtZQUNwRSxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNJLG9CQUFvQjtZQUNwQixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7WUFFOUUsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUk7Z0JBQ3RFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1YsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDN0IsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDUCxPQUFPLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDN0IsQ0FBQztnQkFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ25ELENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUc7Z0JBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDekQsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0ksUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDMUUsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDO0lBQ0YsQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRjs7OztHQUlHO0FBQ0gsTUFBTSxXQUFXLEdBQUcsS0FBSyxXQUFXLFFBQVE7SUFDM0MsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPO1FBQ3ZDLGNBQWM7UUFDZCxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxHQUFHO1lBQzdELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDUCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDZixDQUFDO1FBQ0YsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUNILEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDWixNQUFNLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ3hDLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFVBQVUsR0FBRyxFQUFFLElBQUk7Z0JBQ3hDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNmLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ1AsSUFBSSxDQUFDO3dCQUNKLHVCQUF1Qjt3QkFDdkIsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNwQixxQ0FBcUM7d0JBQ3JDLHlDQUF5Qzt3QkFDekMsd0JBQXdCO3dCQUN4QixpQkFBaUI7d0JBQ2pCLE1BQU07d0JBQ04sZ0NBQWdDO29CQUNqQyxDQUFDO29CQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ1osYUFBYTt3QkFDYixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ1YsTUFBTSxDQUFDO29CQUNSLENBQUM7b0JBQ0QsV0FBVztvQkFDWCxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLENBQUM7WUFDRixDQUFDLENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1AsU0FBUztRQUNULE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDYixDQUFDO0FBQ0YsQ0FBQyxDQUFDO0FBRUYsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDO0lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdkIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztJQUNuQixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLENBQUMsQ0FBQyxDQUFDIn0=