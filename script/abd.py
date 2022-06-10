
import pyspark
from pyspark.sql import SparkSession


spark = SparkSession.builder \
    .master("spark://spark-master:7077") \
    .appName("covid-19") \
    .getOrCreate()
df = spark.read.csv("/data/perkembangan-harian-per-provinsi.csv")
df.printSchema()


# from pyspark.sql.functions import mean, desc


# columns = ["language","users_count"]
# data = [("Java", "20000"), ("Python", "100000"), ("Scala", "3000")]
# rdd = spark.sparkContext.parallelize(data)

# df = rdd.toDF()
# df.printSchema()
# df.show()

# df.filter(df["country"] == "france") \ # only french stations
#   .groupBy("station_id") \ # by station
#   .agg(mean("temperature").alias("average_temp")) \ # calculate average
#   .orderBy(desc("average_temp")) \ # order by average 
#   .take(100) # return first 100 rows

# df.rdd \
#   .filter(lambda x: x[1] == "france") \ # only french stations
#   .map(lambda x: (x[0], x[2])) \ # select station & temp
#   .mapValues(lambda x: (x, 1)) \ # generate count
#   .reduceByKey(lambda x, y: (x[0]+y[0], x[1]+y[1])) \ # calculate sum & count
#   .mapValues(lambda x: x[0]/x[1]) \ # calculate average
#   .sortBy(lambda x: x[1], ascending = False) \ # sort
#   .take(100)


