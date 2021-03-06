<?php
namespace Applications\Lib;

// 配置文件读取
class Config {

    /**
     * 配置文件目录
     *
     * @var string
     */
    private static $configNameSpace = '';

    /**
     * Conig
     *
     * @var array
     */
    private static $config = array();

    /**
     * 设置配置文件命名空间
     *
     * @param string $namespace
     * @throws \Exception
     * @return void
     */
    public static function setNameSpace($namespace = '')
    {
        if (!$namespace) {
            throw new \Exception('配置文件命名空间为空');
        }

        self::$configNameSpace = $namespace;
    }

    /**
     * 获取配置
     *
     * @param string $configClass
     * @throws \Exception
     * @return array
     */
    protected static function config($configClass = '')
    {
        $className = '\\' . self::$configNameSpace . '\\' . $configClass;
        if (!self::$configNameSpace || !class_exists($className)) {
            throw new \Exception("Config namespace is empty or {$className} not exist.");
        }

        $key = serialize($className);
        if (!isset(self::$config[$key])) {
            self::$config[$key] = (array) new $className();
        }

        return self::$config[$key];
    }

    /**
     * 获取配置项
     *
     * @param string $configName
     * @throws \Exception
     * @return mixed
     */
    public static function get($configName = '')
    {
        if (!$configName) {
            throw new \Exception('配置项为空');
        }

        $spices = explode('.', $configName);
        $config = self::config(array_shift($spices));
        while(count($spices)) {
            $key = array_shift($spices);
            if (!isset($config[$key])) {
                throw new \Exception("{$configName} not exist.");
            }
            if (count($spices)) {
                $config = $config[$key];
                continue ;
            }
            return $config[$key];
        }
    }
}