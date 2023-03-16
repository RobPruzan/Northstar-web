#include <stdio.h>

int main(int argc, char * argv[]){
  int num [5]={1 , 2 , 3 , 3 , 4};

printf("%d", (num[0]+3));
printf("%d", num[3]);
printf("%d", (num+3));
printf("%d", *(num+3));
}