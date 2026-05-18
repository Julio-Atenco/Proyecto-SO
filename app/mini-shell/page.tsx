import DocPage, {
  DocH2,
  DocH3,
  DocP,
  DocUl,
  DocLi,
  DocNote,
  DocWarning,
  CodeBlock,
  InlineCode,
} from "@/components/DocPage";

/* ─────────────────────────────────────────────────────────
   Apunte: Mini-Shell en C — Llamadas al sistema
   Repositorio: https://github.com/LGSC-German/Minishell-en-C/tree/main
   Ruta sugerida: /apuntes/3/3.6_MiniShell
   ───────────────────────────────────────────────────────── */

const toc = [
  { id: "codigo",        label: "Código completo" },
  { id: "repo",          label: "Repositorio" },
  { id: "que-es",        label: "¿Qué es?" },
  { id: "arquitectura",  label: "Arquitectura" },
  { id: "bucle",         label: "El bucle REPL" },
  { id: "parseo",        label: "Parseo de argumentos" },
  { id: "comandos",      label: "Comandos implementados" },
  { id: "ejecucion",     label: "Cómo se ve la ejecución" },
  { id: "compilar",      label: "Compilar y correr" },
  { id: "mejoras",       label: "Cómo mejorarlo" },
];

const SHELL_SRC = `#include <sys/sysmacros.h>
#include <sys/stat.h>
#include <sys/statvfs.h>
#include <sys/syscall.h>
#include <sys/ioctl.h>
#include <sys/utsname.h>
#include <sys/sysinfo.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
//#include <errno.h>
#include <unistd.h>
#include <fcntl.h>
#include <net/if.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <time.h>
#include <utmp.h>

#define MAX_LEN 500

/* Funciones base para el shell*/
char *crearvector(int n)
{
	char *vector = (char *)malloc(n * sizeof(char));
    return vector;
}
int caracter(const char *cadena, int i)
{
	int max = strlen(cadena);
	char caracter[2];
	while( i < max){
		strncpy(caracter,cadena+i,1);
		if (strncmp(caracter," ",1)==0)
			return i;
		i++;
	}
	return 0;
}
int espacios(const char *cadena, int i)
{
	int max = strlen(cadena);
	char caracter[2];
	if (strlen(cadena)==i) return 0;
	strncpy(caracter,cadena+i,1);
	if (strncmp(caracter," ",1)!=0) return -1;
	i++;
	while( i < max){
		strncpy(caracter,cadena+i,1);
		if (strncmp(caracter," ",1)!=0) return i;
		i++;
	}
	return 0;
}
DIR* odir(const char *path)
{
	DIR *directorio;
	if ( (directorio = opendir(path) )== NULL){
			perror("Error ruta");
		}
	return directorio;
}
void funstat(const char *path)
{
	struct stat sb;
	if(stat(path, &sb) == -1){
		perror("Error");
		return;
	}
	printf("ID of containing device:  [%x,%x]\\n", major(sb.st_dev), minor(sb.st_dev));   
	printf("File type:                ");    
	switch (sb.st_mode & S_IFMT) {
       case S_IFBLK:  printf("block device\\n");            break;
       case S_IFCHR:  printf("character device\\n");        break;
       case S_IFDIR:  printf("directory\\n");               break;
       case S_IFIFO:  printf("FIFO/pipe\\n");               break;
       case S_IFLNK:  printf("symlink\\n");                 break;
       case S_IFREG:  printf("regular file\\n");            break;
       case S_IFSOCK: printf("socket\\n");                  break;
       default:       printf("unknown?\\n");                break;	
	}
}
void shell(char *path)
{
	char disenio[MAX_LEN];
	strcpy(disenio, "┌──(minishell)-[");
	strcat(disenio, path);
	strcat(disenio, "]\\n└─$ ");
	printf("%s",disenio);
}

/*Tipado de funciones del shell*/
void PWD(char *opcion);
void CD(char *opcion, char *path);
void MKDIR(const char *path_name, mode_t mode);
void LS(char *opcion, const char *path);
void STAT(const char *opcion);
void CAT(char *opcion);
void RENAME(char *opcion);
void FIND(const char *path, const char *name);
/* wall, ip, mac, numerosdisp, free, uname */
void UNAME(char *opcion);
void IP(char *opcion);
void MAC(char *opcion);
void FREE(char *opcion);
void WALL(char *opcion);
void MESG(char *opcion);
//unlink, vfstat, date, who, mesg
void UNLINK(char *path);
void VFSTAT(char *opcion);
void DATE();
void WHO();

int main (int argc, char *argv[ ])
{
	char opcion[MAX_LEN], path[MAX_LEN], *auxiliar;
	int i,j;
	strcpy(path,getcwd(argv[0], MAX_LEN));
	
	while (1)
	{
		strcpy(path,getcwd(path, MAX_LEN));
		shell(path);
		fgets(opcion, MAX_LEN, stdin);
		opcion[strlen(opcion)-1] = 0;
		i = espacios(opcion,0);
		if (i != -1) // valida espacios antes de cualquier caracter
			strcpy(opcion,opcion+i);
		if (strncmp(opcion,"pwd",3) == 0) PWD(opcion);
		if (strncmp(opcion,"cd",2) == 0) CD(opcion, path);
		if (strncmp(opcion,"mkdir",5) == 0) MKDIR(opcion,0775);
		if (strncmp(opcion,"ls",2) == 0) LS(opcion,path);
		if (strncmp(opcion,"stat",3) == 0) STAT(opcion);
		if (strncmp(opcion,"cat",3) == 0) CAT(opcion);
		if (strncmp(opcion,"rename",6) == 0) RENAME(opcion);
		if (strncmp(opcion,"uname",5) == 0) UNAME(opcion);
		if(strncmp(opcion,"find",4) == 0){
			auxiliar = crearvector(MAX_LEN);
			i = espacios(opcion, 4);
			j = caracter(opcion, i);
			strncpy(auxiliar,opcion+i,j-i);
			path[j-i] = 0;
			printf("%s\\n",auxiliar);
			printf("%s\\n",opcion+j);
			j = espacios(opcion, j);
			FIND(auxiliar,opcion+j);
			free(auxiliar);
		}
		if (strncmp(opcion,"ip",2) == 0) IP(opcion);
		if (strncmp(opcion,"mac",3) == 0) MAC(opcion);
		if (strncmp(opcion,"free",4) == 0) FREE(opcion);
		if (strncmp(opcion,"wall",4) == 0) WALL(opcion);//pruebalo julio no me jala se lo pedi a copilot
		if (strncmp(opcion,"mesg",4) == 0) MESG(opcion);//pruebalo julio no me jala se lo pedi a copilot
		if (strncmp(opcion,"unlink",6) == 0) UNLINK(opcion);
		if (strncmp(opcion,"vfstat",6) == 0) VFSTAT(opcion);
		if (strncmp(opcion,"date",4) == 0) DATE();
		if (strncmp(opcion,"who",4) == 0) WHO();
		if(strcmp(opcion,"exit") == 0 || strcmp(opcion,"EXIT") == 0)
			exit (1);
		strcpy(opcion,"");
		printf("\\n");
		
	}
}

void PWD(char *opcion)
{
	int num = espacios(opcion,3);
    if (num >= 0)
		printf("%s\\n",getcwd(opcion+3, MAX_LEN));
	else
		printf("\\e[0;33mComando invalido:\\e[0m quizas es pwd\\n");
}

void CD(char *opcion, char *path)
{
	int num = espacios(opcion,2);
	if (num == -1 ||  num == 0){
		printf ("\\e[0;33mComando invalido:\\e[0m cd <direccion>\\n");
	} else{
		strcpy(path,opcion+num);
		num = chdir(path);
		if (num == -1) printf("\\033[0;33mRuta invalida:\\033[0m cd <ruta>\\n");
	}
	return;
}

void MKDIR(const char *path_name, mode_t mode)
{
	int num = espacios(path_name,5);
	if (num == -1) printf("\\e[0;33mComando invalido:\\e[0m mkdir <ruta_nombre>\\n");
	else if (num == -1) printf("\\e[0;33mRuta invalida:\\e[0m mkdir <ruta>\\n");
	else if(mkdir(path_name+num,mode) == 0) printf("Creado con exito\\n");
	return;
}

void LS(char *opcion, const char *path)
{
	DIR *directorio;
	struct dirent *entradadir; 
	int tipo = 0, j = 0;
	int i = espacios(opcion,2);
	if(i == -1) {
		printf("\\e[0;33mComando invalido:\\e[0m quizas es ls\\n");
		return;
	}
	if(i != 0){
		if(strncmp(opcion+i,"-",1)!=0){
			printf("\\e[0;33mComando incorrecto:\\e[0m ls -<bandera>\\n");
			return;
		}
		i++;
		if(strncmp(opcion+i,"l",1)==0) tipo=1;
		if(strncmp(opcion+i,"a",1)==0) tipo=2;
		if(strncmp(opcion+i,"i",1)==0) tipo=3;
		if(strncmp(opcion+i,"la",2)==0) tipo=4;
		if(strncmp(opcion+i,"li",2)==0) tipo=5;
		if(strncmp(opcion+i,"lai",2)==0) tipo=6;
		
		if(tipo>0 && tipo<4) i++;
		if(tipo==4 || tipo==5) i=i+2;
		if(tipo==6) i=i+3;
		j = espacios(opcion,i);
	}
	if(j==-1){
			printf("\\e[0;33mBandera incorreta:\\e[0m %s", opcion+i);
			return;
	}
	
	directorio = odir(path); // -l la a i li lai
	if (directorio == NULL)
		return;
	while ( (entradadir = readdir (directorio) ) != NULL){
		char fullpath[512];
		snprintf(fullpath, sizeof(fullpath), "%s/%s", path, entradadir->d_name);// es lo mismo que aplicar 1 strcpy y 2 strcat

		if (tipo == 2 || tipo == 4 || tipo == 6){
			if (tipo == 6) printf("%10ld  ",entradadir->d_ino);
			if (tipo == 4 || tipo == 6) {
				struct stat sb;
				if (stat(fullpath, &sb) == -1) {
					perror("stat");
				} else {
					printf("[%x,%x] ", major(sb.st_dev), minor(sb.st_dev));
					switch (sb.st_mode & S_IFMT) {
						case S_IFBLK:  printf("block ");     break;
						case S_IFCHR:  printf("char ");      break;
						case S_IFDIR:  printf("dir ");       break;
						case S_IFIFO:  printf("fifo ");      break;
						case S_IFLNK:  printf("link ");      break;
						case S_IFREG:  printf("file ");      break;
						case S_IFSOCK: printf("socket ");    break;
						default:       printf("unknown ");   break;
					}
				}
			}

			if (entradadir->d_type==DT_DIR) printf(" %s\\n",entradadir ->d_name);
			else if (entradadir->d_type==DT_REG) printf("\\e[34m %s\\e[0m\\n",entradadir ->d_name);
			else if (entradadir->d_type==DT_FIFO) printf("\\e[33m %s\\e[0m\\n",entradadir ->d_name);
			else if (entradadir->d_type==DT_LNK) printf("\\e[36m %s\\e[0m\\n",entradadir ->d_name);
			else printf("\\e[31m%s\\e[0m\\n",entradadir ->d_name);

		} else if (strcmp(entradadir->d_name, ".") != 0 && strcmp(entradadir->d_name, "..") != 0) {
			if (tipo == 3 || tipo == 5) printf("%10ld  ",entradadir->d_ino);
			if (tipo == 1 || tipo == 5) {
				struct stat sb;
				if (stat(fullpath, &sb) == -1) {
					perror("stat");
				} else {
					printf("[%x,%x] ", major(sb.st_dev), minor(sb.st_dev));
					switch (sb.st_mode & S_IFMT) {
						case S_IFBLK:  printf("block ");     break;
						case S_IFCHR:  printf("char ");      break;
						case S_IFDIR:  printf("dir ");       break;
						case S_IFIFO:  printf("fifo ");      break;
						case S_IFLNK:  printf("link ");      break;
						case S_IFREG:  printf("file ");      break;
						case S_IFSOCK: printf("socket ");    break;
						default:       printf("unknown ");   break;
					}
				}
			}

			if (entradadir->d_type==DT_DIR) printf(" %s\\n",entradadir ->d_name);
			else if (entradadir->d_type==DT_REG) printf("\\e[34m %s\\e[0m\\n",entradadir ->d_name);
			else if (entradadir->d_type==DT_FIFO) printf("\\e[33m %s\\e[0m\\n",entradadir ->d_name);
			else if (entradadir->d_type==DT_LNK) printf("\\e[36m %s\\e[0m\\n",entradadir ->d_name);
			else printf("\\e[31m%s\\e[0m\\n",entradadir ->d_name);

		}
	}
	closedir(directorio);	
}

void STAT(const char *opcion)
{
	int i = espacios(opcion,4);
	
	if (i == -1) {
		 printf("\\e[0;33mComando invalido:\\e[0m quizas es stat\\n");
		 return;
	}
	if (i == 0){
		printf ("\\e[0;33mDireccion invalida:\\e[0m stat <direccion>\\n");
		return;
	}
	
	DIR *directorio;
	directorio = odir(opcion+i);
	if (directorio == NULL)	return;
	funstat(opcion+i);
	closedir(directorio);
}

void CAT(char *opcion)
{
	char texto[5000];
	int i = espacios(opcion,3);
	if (i == -1) {
		 printf("\\e[0;33mComando invalido:\\e[0m quizas es cat\\n");
		 return;
	}
	int b = open(opcion+i, O_RDONLY);
	if (b == -1){
		printf ("\\e[0;33mDireccion invalida:\\e[0m cat <direccion>\\n");
		return;
	}
	int n = read(b, texto, sizeof(texto));
	write(STDOUT_FILENO, texto, n);
	close(b);
}

void RENAME(char *opcion)
{
	char name[MAX_LEN];
	int i = espacios(opcion, 6);
	if (i == -1) {
		 printf("\\e[0;33mComando invalido:\\e[0m quizas es rename\\n");
		 return;
	} 
	if (i == 0) {
		 printf("\\e[0;33mDireccion invalida:\\e[0m quizas es rename <nombre_actual> <nombre_nuevo>\\n");
		 return;
	}
	int j = caracter(opcion, i);
	strncpy(name,opcion+i,j-i);
	j = espacios(opcion, j);
	printf("%s\\n%s\\n",name,opcion+j);
	i = rename(name,opcion+j);
	if (i != 0){
		printf("\\e[0;33mError:\\e[0m No renombrado");
		return;
	}
	printf("Renombrado: \\e[0;32m%s --> %s\\e[0m\\n",name,opcion+j);
	return;
}

void FIND(const char *path, const char *name)
{
	int j = strlen(name);
	char newpath[MAX_LEN],base[MAX_LEN];
	DIR *directorio;
	struct dirent *entradadir;
	directorio = odir(path);
	if (directorio == NULL)	return;
	strcpy(base,path);
	strcat(base,"/");
	while ( (entradadir = readdir (directorio) ) != NULL){
		strcpy(newpath,base);
		if (entradadir->d_type==DT_REG){
			if (strncmp(name,entradadir ->d_name,j)==0){
				printf("\\e[34mArchivo encontrado en este directorio:\\e[0m %s\\n",newpath);
				strcat(newpath,entradadir ->d_name);
				funstat(newpath);
			} else{ 
				strcat(newpath,entradadir ->d_name);
				printf("%s\\n",newpath);
			}
		}
		if (entradadir->d_type==DT_DIR){
			strcat(newpath,entradadir ->d_name);
			if (strcmp(entradadir->d_name, ".") != 0 && strcmp(entradadir->d_name, "..") != 0) {
				FIND(newpath, name);
			}
		}
	}
	closedir(directorio);
}

void UNAME(char *opcion)
{
	struct utsname syst;  // estructura real, no puntero
    int i = espacios(opcion, 5);
    if (i == -1){
        printf("\\e[0;33mComando invalido:\\e[0m quizas es uname \\n");
        return;
    }

    if (uname(&syst) == -1){  // pasamos la dirección
        printf("\\e[0;33mError en uname:\\e[0m no obtencion \\n");
        return;
    }

    printf("%s %s %s %s %s\\n", syst.sysname, syst.nodename, syst.release, syst.version, syst.machine);
}

void IP(char *opcion)
{
	if (espacios(opcion, 2) == -1){
		printf("\\e[0;33mComando invalido:\\e[0m quizas es ip\\n");
		return;
	}
	int sock;
    struct ifreq ifr;
    struct sockaddr_in *ipaddr;
    sock = socket(AF_INET, SOCK_DGRAM, 0);
    if (sock == -1) {
        perror("Error creando socket");
        return;
    }
    strncpy(ifr.ifr_name, "docker0", IFNAMSIZ - 1);
    if (ioctl(sock, SIOCGIFADDR, &ifr) == -1) {
        perror("ioctl SIOCGIFADDR (¿Está activa la interfaz?)");
    } else {
        ipaddr = (struct sockaddr_in *)&ifr.ifr_addr;
        printf("IP de docker0: %s\\n", inet_ntoa(ipaddr->sin_addr));
    }
    strncpy(ifr.ifr_name, "lo", IFNAMSIZ - 1);
    if (ioctl(sock, SIOCGIFADDR, &ifr) == -1) {
        perror("ioctl SIOCGIFADDR (¿Está activa la interfaz?)");
    } else {
        ipaddr = (struct sockaddr_in *)&ifr.ifr_addr;
        printf("IP de lo: %s\\n", inet_ntoa(ipaddr->sin_addr));
    }    
    strncpy(ifr.ifr_name, "wlan0", IFNAMSIZ - 1);
    if (ioctl(sock, SIOCGIFADDR, &ifr) == -1) {
        perror("ioctl SIOCGIFADDR (¿Está activa la interfaz?)");
    } else {
        ipaddr = (struct sockaddr_in *)&ifr.ifr_addr;
        printf("IP de wlan0: %s\\n", inet_ntoa(ipaddr->sin_addr));
    }
}

void MAC(char *opcion)
{
	if (espacios(opcion, 3) == -1){
		printf("\\e[0;33mComando invalido:\\e[0m quizas es mac\\n");
		return;
	}
	int sock;
    struct ifreq ifr;
    unsigned char *mac;
    sock = socket(AF_INET, SOCK_DGRAM, 0);
    if (sock == -1) {
        perror("Error creando socket");
        return;
    }
    strncpy(ifr.ifr_name, "docker0", IFNAMSIZ - 1);
    if (ioctl(sock, SIOCGIFHWADDR, &ifr) == -1) {
        perror("ioctl SIOCGIFHWADDR");
    } else {
       mac = (unsigned char *)ifr.ifr_hwaddr.sa_data;
        printf("MAC de docker0: %02x:%02x:%02x:%02x:%02x:%02x\\n", 
               mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
    }
    strncpy(ifr.ifr_name, "lo", IFNAMSIZ - 1);
    if (ioctl(sock, SIOCGIFHWADDR, &ifr) == -1) {
        perror("ioctl SIOCGIFHWADDR");
    } else {
       mac = (unsigned char *)ifr.ifr_hwaddr.sa_data;
        printf("MAC de lo: %02x:%02x:%02x:%02x:%02x:%02x\\n", 
               mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
    }
    strncpy(ifr.ifr_name, "wlan0", IFNAMSIZ - 1);
    if (ioctl(sock, SIOCGIFHWADDR, &ifr) == -1) {
        perror("ioctl SIOCGIFHWADDR");
    } else {
       mac = (unsigned char *)ifr.ifr_hwaddr.sa_data;
        printf("MAC de wlan0: %02x:%02x:%02x:%02x:%02x:%02x\\n", 
               mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
    }
}

void FREE(char *opcion)
{
	if (espacios(opcion, 4) == -1){
		printf("\\e[0;33mComando invalido:\\e[0m quizas es free\\n");
		return;
	}
	
    struct sysinfo info;

    if (sysinfo(&info) == 0) {
        printf("Memoria total: %lu \\n", info.totalram);
        printf("Memoria libre: %lu \\n", info.freeram);
        printf("Memoria usada: %lu \\n", (info.totalram - info.freeram));
        printf("Swap total: %lu \\n", info.totalswap);
        printf("Swap libre: %lu \\n", info.freeswap);
    } else {
        perror("Error al obtener información de memoria");
    }

    return;
}


void UNLINK(char *opcion)
{
	int i = espacios(opcion,6);
	if (i <= 0){
		printf("\\e[0;33mUso:\\e[0m unlink <archivo>\\n");
		return;
	}

	if (unlink(opcion+i) == -1){
		perror("Error");
		return;
	}

	printf("Archivo eliminado: %s\\n", opcion+i);
}

void VFSTAT(char *opcion)
{
	int i = espacios(opcion,6);
	struct statvfs vfs;

	if (i == -1){
		printf("\\e[0;33mUso:\\e[0m vfstat <archivo>\\n");
		return;
	}

	if (statvfs(opcion+i, &vfs) != 0){
		perror("llamado de statvfs");
		return;
	}
	
	printf("\\tArchivo:%s", opcion+1);
	printf("\\tTamaño de bloques: %ld\\n",  (long) vfs.f_bsize);
	printf("\\tTamaño de fragmento: %ld\\n", (long) vfs.f_frsize);
	printf("\\tTamaño en unidades: %lu\\n", (unsigned long) vfs.f_blocks);
	printf("\\tBloques libres %lu\\n",  (unsigned long) vfs.f_bfree);
	printf("\\tBloques Disponibles: %lu\\n", (unsigned long) vfs.f_bavail);
	printf("\\tNúmero de Inodos: %lu\\n",  (unsigned long) vfs.f_files);
	printf("\\tNúmero de Inodos Libres: %lu\\n",  (unsigned long) vfs.f_ffree);
	printf("\\tNúmero de Inodos Disponibles: %lu\\n", (unsigned long) vfs.f_favail);
	printf("\\tID del S.A.: %#lx\\n",  (unsigned long) vfs.f_fsid);
	printf("\\tBandera: ");
	if (vfs.f_flag == 0)
		printf("(Ninguna)\\n");
	else {
		if ((vfs.f_flag & ST_RDONLY) != 0)
			printf("ST_RDONLY ");
		if ((vfs.f_flag & ST_NOSUID) != 0)
			printf("ST_NOSUID");
		printf("\\n");
	}
	printf("\\tLongitud max para archivo: %ld\\n", (long)vfs.f_namemax);
}

void DATE()
{
	time_t t;
	struct tm *date;

	time(&t);
	date = localtime(&t);

	char fecha[100];
	strftime(fecha, sizeof(fecha), "%Y-%m-%d %a %H:%M:%S", date);

	printf("%s\\n", fecha);
}

void WHO()
{
	struct utmp *usuarios;
	setutent(); // inicio
	while ((usuarios = getutent()) != NULL){
		if (usuarios->ut_type == USER_PROCESS){
			printf("%s\\t%s\\n", usuarios->ut_user, usuarios->ut_line);
		}
	}
	endutent();
}

void WALL(char *opcion)
{
	int i = espacios(opcion, 4);
	if (i == -1){
		printf("\\e[0;33mComando invalido:\\e[0m quizas es wall\\n");
		return;
	}
	if (i == 0){
		printf("\\e[0;33mwall invalido:\\e[0m falta mensaje\\n");
		return;
	}
	struct utmp *ut;

    setutent();
    while ((ut = getutent()) != NULL) {
        if (ut->ut_type == USER_PROCESS) {
            char tty_path[64];
            snprintf(tty_path, sizeof(tty_path), "/dev/%s", ut->ut_line);
            int fd = open(tty_path, O_WRONLY | O_NONBLOCK);
            if (fd != -1) {
                dprintf(fd, "\\nBroadcast message:\\n%s\\n", opcion+i);
                close(fd);
            }
        }
    }
    endutent();
}

void MESG(char *opcion)
{
	int i = espacios(opcion, 4);
	if (i == -1){
		printf("\\e[0;33mComando invalido:\\e[0m quizas es mesg\\n");
		return;
	}
	if (i == 0){
		printf("\\e[0;33mmesg invalido:\\e[0m falta usuario y mensaje\\n");
		return;
	}
	char name[29];
	int j = caracter(opcion, i);
	strncpy(name,opcion+i,j-i);
	i = espacios(opcion,j);
	if (i == 0){
		printf("\\e[0;33mmesg invalido:\\e[0m falta mensaje\\n");
		return;
	}
	int bandera = 1;
	struct utmp *ut;

    setutent();
    while ((ut = getutent()) != NULL) {
        if (ut->ut_type == USER_PROCESS) {
            if (strcmp(name, ut->ut_user) == 0) {
				bandera = 0;
                char tty_path[64];
                snprintf(tty_path, sizeof(tty_path), "/dev/%s", ut->ut_line);
                int fd = open(tty_path, O_WRONLY | O_NONBLOCK);
                if (fd != -1) {
                    dprintf(fd, "\\nBroadcast message:\\n%s\\n", opcion+i);
                    close(fd);
                }
            }
        }
    }
    endutent();
    if (bandera){
		printf("\\e[0;33musuario invalido:\\e[0m usuario no encontrado\\n");
		return;
	}
}
`;

export default function MiniShellPage() {
  return (
    <DocPage
      section=" Mini-Shell"
      title="Mini-Shell en C con llamadas al sistema"
      category="Practica de sistemas operativos"
      readTime="15 min"
      toc={toc}
      prev={{ href: "/", label: "Inicio" }}
      next={{ href: "/programas", label: "Programas" }}
    >
      {/* ─── CÓDIGO COMPLETO AL INICIO ────────────────────── */}
      <DocH2 id="codigo">Código completo</DocH2>
      <DocP>
        Este es el programa completo del mini-shell tal cual se entregó. Más
        abajo se explica qué hace cada parte, cómo se ve en ejecución y, al
        final, una guía detallada de cómo mejorarlo.
      </DocP>

      <CodeBlock filename="shell-entrega.c" lang="c" code={SHELL_SRC} />

      {/* ─── REPOSITORIO ──────────────────────────────────── */}
      <DocH2 id="repo">Repositorio</DocH2>
      <DocP>
        El código fuente vive en GitHub. Puedes clonarlo, revisar el historial
        de commits y abrir issues o pull requests con mejoras:
      </DocP>
      <DocNote>
        Repositorio:{" "}
        <a
          href="https://github.com/LGSC-German/Minishell-en-C/tree/main"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-mono break-all"
        >
          github.com/LGSC-German/Minishell-en-C
        </a>
      </DocNote>
      <CodeBlock
        filename="Terminal — clonar"
        lang="bash"
        code={`git clone https://github.com/LGSC-German/Minishell-en-C.git
cd Minishell-en-C
gcc -Wall -Wextra -o minishell shell-entrega.c
./minishell`}
      />

      {/* ─── ¿Qué es? ─────────────────────────────────────── */}
      <DocH2 id="que-es">¿Qué es este programa?</DocH2>
      <DocP>
        Es un <strong>intérprete de comandos</strong> (shell) minimalista escrito
        en C que reimplementa, desde cero y usando llamadas al sistema de Linux,
        una colección de comandos clásicos de Unix:{" "}
        <InlineCode>pwd</InlineCode>, <InlineCode>cd</InlineCode>,{" "}
        <InlineCode>ls</InlineCode>, <InlineCode>mkdir</InlineCode>,{" "}
        <InlineCode>stat</InlineCode>, <InlineCode>cat</InlineCode>,{" "}
        <InlineCode>rename</InlineCode>, <InlineCode>find</InlineCode>,{" "}
        <InlineCode>uname</InlineCode>, <InlineCode>ip</InlineCode>,{" "}
        <InlineCode>mac</InlineCode>, <InlineCode>free</InlineCode>,{" "}
        <InlineCode>unlink</InlineCode>, <InlineCode>vfstat</InlineCode>,{" "}
        <InlineCode>date</InlineCode>, <InlineCode>who</InlineCode>,{" "}
        <InlineCode>wall</InlineCode> y <InlineCode>mesg</InlineCode>.
      </DocP>
      <DocP>
        En vez de invocar los binarios reales del sistema (no usa{" "}
        <InlineCode>exec</InlineCode> ni <InlineCode>fork</InlineCode>), cada
        comando se resuelve directamente con la API del kernel:{" "}
        <InlineCode>getcwd</InlineCode>, <InlineCode>chdir</InlineCode>,{" "}
        <InlineCode>opendir/readdir</InlineCode>, <InlineCode>stat</InlineCode>,{" "}
        <InlineCode>statvfs</InlineCode>, <InlineCode>sysinfo</InlineCode>,{" "}
        <InlineCode>uname</InlineCode>, <InlineCode>ioctl</InlineCode> sobre
        sockets, <InlineCode>utmp</InlineCode>, etc. Es un ejercicio excelente
        para entender cómo funcionan por dentro las utilidades de la terminal.
      </DocP>

      <DocNote>
        El prompt dibuja una estética estilo Kali Linux:{" "}
        <InlineCode>{`┌──(minishell)-[/ruta]`}</InlineCode> y{" "}
        <InlineCode>{`└─$`}</InlineCode>. La ruta se recalcula con{" "}
        <InlineCode>getcwd()</InlineCode> en cada iteración del bucle.
      </DocNote>

      {/* ─── Arquitectura ─────────────────────────────────── */}
      <DocH2 id="arquitectura">Arquitectura general</DocH2>
      <DocP>El programa se organiza en tres capas:</DocP>
      <DocUl>
        <DocLi>
          <strong>Funciones base:</strong> <InlineCode>crearvector()</InlineCode>{" "}
          (reserva memoria), <InlineCode>caracter()</InlineCode> y{" "}
          <InlineCode>espacios()</InlineCode> (analizan la cadena de entrada),{" "}
          <InlineCode>odir()</InlineCode> (abre directorios) y{" "}
          <InlineCode>funstat()</InlineCode> (imprime metadatos de un archivo).
        </DocLi>
        <DocLi>
          <strong>Bucle principal (<InlineCode>main</InlineCode>):</strong> un
          ciclo infinito que lee una línea, identifica el comando por su prefijo
          y despacha a la función correspondiente.
        </DocLi>
        <DocLi>
          <strong>Funciones de comando:</strong> una función por comando
          (<InlineCode>PWD</InlineCode>, <InlineCode>CD</InlineCode>,{" "}
          <InlineCode>LS</InlineCode>, <InlineCode>FIND</InlineCode>…) que valida
          argumentos y ejecuta la llamada al sistema.
        </DocLi>
      </DocUl>

      {/* ─── Bucle REPL ───────────────────────────────────── */}
      <DocH2 id="bucle">El bucle REPL</DocH2>
      <DocP>
        El corazón del shell es un <InlineCode>while(1)</InlineCode> que:
        actualiza la ruta, dibuja el prompt, lee con{" "}
        <InlineCode>fgets()</InlineCode>, quita el salto de línea final, salta
        espacios iniciales y compara el comando con{" "}
        <InlineCode>strncmp()</InlineCode>.
      </DocP>

      <DocWarning>
        El despacho usa <InlineCode>strncmp()</InlineCode> con cadenas{" "}
        <em>encadenadas con <InlineCode>if</InlineCode> independientes</em> (no{" "}
        <InlineCode>else if</InlineCode>). Esto provoca colisiones de prefijo —
        se detalla y se corrige en la sección final.
      </DocWarning>

      {/* ─── Parseo ───────────────────────────────────────── */}
      <DocH2 id="parseo">Parseo de argumentos</DocH2>
      <DocP>
        Toda la separación de argumentos depende de dos funciones auxiliares:
      </DocP>
      <DocUl>
        <DocLi>
          <InlineCode>espacios(cadena, i)</InlineCode>: a partir de la posición{" "}
          <InlineCode>i</InlineCode>, devuelve el índice del primer carácter
          después de los espacios. Devuelve <InlineCode>-1</InlineCode> si no hay
          espacio donde se esperaba (valida la sintaxis del comando) y{" "}
          <InlineCode>0</InlineCode> si llegó al final.
        </DocLi>
        <DocLi>
          <InlineCode>caracter(cadena, i)</InlineCode>: devuelve el índice del
          siguiente espacio (el final de un token). Sirve para extraer el primer
          argumento en comandos de dos argumentos como{" "}
          <InlineCode>rename</InlineCode> o <InlineCode>find</InlineCode>.
        </DocLi>
      </DocUl>

      {/* ─── Comandos ─────────────────────────────────────── */}
      <DocH2 id="comandos">Comandos implementados</DocH2>
      <DocP>
        Cada comando es un envoltorio pedagógico sobre una llamada al sistema:
      </DocP>
      <DocUl>
        <DocLi>
          <InlineCode>pwd</InlineCode> / <InlineCode>cd</InlineCode> →{" "}
          <InlineCode>getcwd()</InlineCode> / <InlineCode>chdir()</InlineCode>
        </DocLi>
        <DocLi>
          <InlineCode>ls</InlineCode> →{" "}
          <InlineCode>opendir / readdir / closedir</InlineCode> con banderas{" "}
          <InlineCode>-l</InlineCode>, <InlineCode>-a</InlineCode>,{" "}
          <InlineCode>-i</InlineCode> y combinaciones; usa{" "}
          <InlineCode>stat()</InlineCode> y <InlineCode>major/minor</InlineCode>.
        </DocLi>
        <DocLi>
          <InlineCode>mkdir</InlineCode> → <InlineCode>mkdir()</InlineCode> con
          modo <InlineCode>0775</InlineCode>.
        </DocLi>
        <DocLi>
          <InlineCode>stat</InlineCode> / <InlineCode>vfstat</InlineCode> →{" "}
          <InlineCode>stat()</InlineCode> / <InlineCode>statvfs()</InlineCode>.
        </DocLi>
        <DocLi>
          <InlineCode>cat</InlineCode> →{" "}
          <InlineCode>open / read / write / close</InlineCode> (E/S de bajo
          nivel).
        </DocLi>
        <DocLi>
          <InlineCode>rename</InlineCode> / <InlineCode>unlink</InlineCode> →{" "}
          <InlineCode>rename()</InlineCode> / <InlineCode>unlink()</InlineCode>.
        </DocLi>
        <DocLi>
          <InlineCode>find</InlineCode> → recorrido recursivo con{" "}
          <InlineCode>readdir</InlineCode> + <InlineCode>funstat()</InlineCode>.
        </DocLi>
        <DocLi>
          <InlineCode>uname</InlineCode> / <InlineCode>free</InlineCode> →{" "}
          <InlineCode>uname()</InlineCode> / <InlineCode>sysinfo()</InlineCode>.
        </DocLi>
        <DocLi>
          <InlineCode>ip</InlineCode> / <InlineCode>mac</InlineCode> →{" "}
          <InlineCode>socket()</InlineCode> + <InlineCode>ioctl()</InlineCode>{" "}
          (<InlineCode>SIOCGIFADDR</InlineCode>,{" "}
          <InlineCode>SIOCGIFHWADDR</InlineCode>).
        </DocLi>
        <DocLi>
          <InlineCode>date</InlineCode> →{" "}
          <InlineCode>time / localtime / strftime</InlineCode>.
        </DocLi>
        <DocLi>
          <InlineCode>who</InlineCode> / <InlineCode>wall</InlineCode> /{" "}
          <InlineCode>mesg</InlineCode> → base{" "}
          <InlineCode>utmp</InlineCode> + escritura sobre{" "}
          <InlineCode>/dev/&lt;tty&gt;</InlineCode>.
        </DocLi>
      </DocUl>

      {/* ─── Ejecución ────────────────────────────────────── */}
      <DocH2 id="ejecucion">Cómo se ve la ejecución</DocH2>
      <DocP>
        Una sesión típica del mini-shell. El prompt se redibuja tras cada
        comando con la ruta actual:
      </DocP>

      <CodeBlock
        filename="Sesión interactiva"
        lang="bash"
        code={`$ gcc -Wall -Wextra shell-entrega.c -o minishell
$ ./minishell`}
        output={`┌──(minishell)-[/home/german/SO]
└─$ pwd
/home/german/SO

┌──(minishell)-[/home/german/SO]
└─$ ls -la
[8,2] dir  .
[8,2] dir  ..
[8,2] file  shell-entrega.c
[8,2] file  minishell
[8,2] dir  practicas

┌──(minishell)-[/home/german/SO]
└─$ cd practicas

┌──(minishell)-[/home/german/SO/practicas]
└─$ date
2025-05-18 dom 14:32:07

┌──(minishell)-[/home/german/SO/practicas]
└─$ free
Memoria total: 16572399616
Memoria libre: 9183420416
Memoria usada: 7388979200
Swap total:  2147479552
Swap libre:  2147479552

┌──(minishell)-[/home/german/SO/practicas]
└─$ uname
Linux german-pc 6.8.0-40-generic #40-Ubuntu SMP x86_64

┌──(minishell)-[/home/german/SO/practicas]
└─$ exit
$`}
        outputNote="salida ilustrativa — depende de tu sistema"
      />

      <DocP>
        El comando <InlineCode>stat</InlineCode> muestra los metadatos crudos del
        inodo:
      </DocP>

      <CodeBlock
        filename="stat de un directorio"
        lang="bash"
        code={`└─$ stat /etc`}
        output={`ID of containing device:  [8,2]
File type:                directory`}
        outputNote="major/minor del dispositivo + tipo"
      />

      {/* ─── Compilar ─────────────────────────────────────── */}
      <DocH2 id="compilar">Compilar y correr</DocH2>
      <CodeBlock
        filename="Terminal"
        lang="bash"
        code={`# Compilación recomendada (con advertencias activadas)
gcc -Wall -Wextra -o minishell shell-entrega.c

# Ejecutar
./minishell

# Para salir del shell
└─$ exit`}
      />

      <DocWarning>
        Algunos comandos (<InlineCode>wall</InlineCode>,{" "}
        <InlineCode>mesg</InlineCode>, lectura de{" "}
        <InlineCode>utmp</InlineCode>, escritura en{" "}
        <InlineCode>/dev/tty</InlineCode>) requieren permisos y sesiones de
        usuario activas. En contenedores Docker o sesiones SSH sin TTY pueden no
        producir salida visible.
      </DocWarning>

      {/* ════════════════════════════════════════════════════ */}
      {/* ─── CÓMO MEJORARLO (sección ampliada al final) ────── */}
      {/* ════════════════════════════════════════════════════ */}
      <DocH2 id="mejoras">Cómo mejorarlo — guía detallada</DocH2>
      <DocP>
        El programa funciona y es muy didáctico, pero tiene varios problemas
        reales. Aquí va cada uno explicado: <strong>qué pasa</strong>,{" "}
        <strong>por qué es un problema</strong> y <strong>cómo se arregla</strong>,
        ordenado de lo más crítico a lo cosmético.
      </DocP>

      {/* 1 */}
      <DocH3 id="m1">1. El despacho de comandos está roto (lo más grave)</DocH3>
      <DocP>
        <strong>Qué pasa:</strong> en <InlineCode>main</InlineCode> cada comando
        se prueba con un <InlineCode>if</InlineCode> separado e independiente, y
        la comparación es por <em>prefijo</em> con una longitud fija que muchas
        veces no coincide con la longitud real de la palabra:
      </DocP>
      <CodeBlock
        filename="El bug — main()"
        lang="c"
        code={`if (strncmp(opcion,"stat",3) == 0) STAT(opcion);   // compara solo "sta"
if (strncmp(opcion,"cat",3)  == 0) CAT(opcion);    // ok 3 letras
if (strncmp(opcion,"who",4)  == 0) WHO();          // longitud 4 sobre 3 letras
if (strncmp(opcion,"ip",2)   == 0) IP(opcion);
if (strncmp(opcion,"mkdir",5)== 0) MKDIR(opcion,0775);`}
      />
      <DocP>
        <strong>Por qué es un problema:</strong> como son{" "}
        <InlineCode>if</InlineCode> sueltos (no{" "}
        <InlineCode>else if</InlineCode>), <em>todos</em> se evalúan en cada
        línea. Un comando que comparta prefijo con otro puede disparar la función
        equivocada o dos funciones a la vez. Y comparar solo 3 caracteres de{" "}
        <InlineCode>"stat"</InlineCode> hace que cualquier palabra que empiece
        con <InlineCode>sta</InlineCode> entre por ahí.
      </DocP>
      <DocP>
        <strong>Cómo se arregla:</strong> separar el primer token <em>una sola
        vez</em> con <InlineCode>strtok()</InlineCode>, compararlo con{" "}
        <InlineCode>strcmp()</InlineCode> exacto, y usar una{" "}
        <strong>tabla de despacho</strong> con punteros a función. Así se agrega
        un comando nuevo sin tocar <InlineCode>main</InlineCode> y se eliminan
        de golpe todos los bugs de prefijo:
      </DocP>
      <CodeBlock
        filename="Solución — tabla de despacho"
        lang="c"
        code={`typedef struct {
    const char *nombre;
    void (*fn)(char *args, char *path);
} Comando;

static const Comando tabla[] = {
    { "pwd",   cmd_pwd },
    { "cd",    cmd_cd  },
    { "ls",    cmd_ls  },
    { "cat",   cmd_cat },
    /* … */
    { NULL, NULL }
};

/* dentro del bucle */
char *cmd  = strtok(linea, " ");      // primer token
char *args = strtok(NULL, "");        // resto de la línea
if (cmd) {
    int encontrado = 0;
    for (int k = 0; tabla[k].nombre; k++) {
        if (strcmp(cmd, tabla[k].nombre) == 0) {
            tabla[k].fn(args, path);
            encontrado = 1;
            break;
        }
    }
    if (!encontrado)
        printf("comando no reconocido: %s\n", cmd);
}`}
      />
      <DocNote>
        Bonus: con este patrón cada función de comando recibe ya los argumentos
        limpios y deja de necesitar recalcular{" "}
        <InlineCode>espacios()</InlineCode> en su interior. El código de cada
        comando se simplifica a la mitad.
      </DocNote>

      {/* 2 */}
      <DocH3 id="m2">2. Accesos a memoria fuera de límites</DocH3>
      <DocP>
        <strong>Qué pasa:</strong> tras leer la entrada se hace{" "}
        <InlineCode>opcion[strlen(opcion)-1] = 0;</InlineCode> para borrar el{" "}
        <InlineCode>{`\n`}</InlineCode>.
      </DocP>
      <DocP>
        <strong>Por qué es un problema:</strong> si el usuario pulsa Ctrl-D (EOF)
        o mete una línea vacía, <InlineCode>fgets</InlineCode> puede devolver una
        cadena de longitud 0, entonces <InlineCode>strlen-1</InlineCode> es{" "}
        <InlineCode>-1</InlineCode> y se escribe en{" "}
        <InlineCode>opcion[-1]</InlineCode> — corrupción de memoria y posible
        crash.
      </DocP>
      <DocP>
        <strong>Cómo se arregla:</strong> comprobar el retorno de{" "}
        <InlineCode>fgets</InlineCode> y la longitud antes de tocar el buffer:
      </DocP>
      <CodeBlock
        filename="Solución — lectura segura"
        lang="c"
        code={`if (fgets(opcion, MAX_LEN, stdin) == NULL) {
    printf("\n");          // EOF (Ctrl-D): salir limpio
    break;
}
size_t len = strlen(opcion);
if (len > 0 && opcion[len-1] == '\n')
    opcion[len-1] = '\0';   // quita el salto solo si existe`}
      />
      <DocP>
        Lo mismo aplica a <InlineCode>caracter()</InlineCode>: usa{" "}
        <InlineCode>char caracter[2]</InlineCode> con{" "}
        <InlineCode>strncpy(...,1)</InlineCode> sin poner el{" "}
        <InlineCode>{`'\0'`}</InlineCode>. Funciona por suerte; conviene comparar
        carácter a carácter directamente:{" "}
        <InlineCode>if (cadena[i] == ' ')</InlineCode>.
      </DocP>

      {/* 3 */}
      <DocH3 id="m3">3. <code>cat</code> trunca archivos grandes</DocH3>
      <DocP>
        <strong>Qué pasa:</strong> <InlineCode>CAT</InlineCode> hace{" "}
        <strong>un solo</strong> <InlineCode>read()</InlineCode> a un buffer fijo
        de 5000 bytes.
      </DocP>
      <DocP>
        <strong>Por qué es un problema:</strong> cualquier archivo de más de
        ~5 KB se muestra cortado, y <InlineCode>read()</InlineCode> no garantiza
        leer todo lo pedido aunque quepa.
      </DocP>
      <DocP>
        <strong>Cómo se arregla:</strong> leer en bucle hasta que{" "}
        <InlineCode>read()</InlineCode> devuelva 0 (fin de archivo):
      </DocP>
      <CodeBlock
        filename="Solución — CAT() en bucle"
        lang="c"
        code={`int b = open(opcion+i, O_RDONLY);
if (b == -1) { perror("cat"); return; }

char buf[4096];
ssize_t n;
while ((n = read(b, buf, sizeof(buf))) > 0)
    write(STDOUT_FILENO, buf, n);

if (n == -1) perror("read");
close(b);`}
      />

      {/* 4 */}
      <DocH3 id="m4">4. Fugas de recursos (sockets y descriptores)</DocH3>
      <DocP>
        <strong>Qué pasa:</strong> <InlineCode>IP()</InlineCode> y{" "}
        <InlineCode>MAC()</InlineCode> crean un socket con{" "}
        <InlineCode>socket()</InlineCode> pero nunca lo cierran.
      </DocP>
      <DocP>
        <strong>Por qué es un problema:</strong> cada vez que ejecutas{" "}
        <InlineCode>ip</InlineCode> o <InlineCode>mac</InlineCode> se filtra un
        descriptor de archivo. En un shell de larga vida acabas agotando el
        límite de descriptores del proceso.
      </DocP>
      <DocP>
        <strong>Cómo se arregla:</strong> añadir{" "}
        <InlineCode>close(sock);</InlineCode> antes de salir de la función (en
        todas las ramas, incluidas las de error).
      </DocP>

      {/* 5 */}
      <DocH3 id="m5">5. Bugs concretos detectados</DocH3>
      <DocUl>
        <DocLi>
          <strong><InlineCode>MKDIR</InlineCode>:</strong> tiene una rama muerta —{" "}
          <InlineCode>else if (num == -1)</InlineCode> repetida dos veces, la
          segunda nunca se alcanza. Además no avisa si{" "}
          <InlineCode>mkdir()</InlineCode> falla (p. ej. el directorio ya existe).
          Añadir un <InlineCode>else perror("mkdir");</InlineCode>.
        </DocLi>
        <DocLi>
          <strong><InlineCode>VFSTAT</InlineCode>:</strong> imprime{" "}
          <InlineCode>opcion+1</InlineCode> en lugar de{" "}
          <InlineCode>opcion+i</InlineCode> al mostrar el nombre del archivo —
          sale basura. Corregir el índice.
        </DocLi>
        <DocLi>
          <strong><InlineCode>ls</InlineCode>:</strong> nunca usa la ruta como
          argumento; siempre lista <InlineCode>path</InlineCode> (el directorio
          actual). <InlineCode>ls /tmp</InlineCode> no funciona como se espera.
          Hay que parsear la ruta opcional y pasarla a{" "}
          <InlineCode>odir()</InlineCode>.
        </DocLi>
        <DocLi>
          <strong><InlineCode>wall</InlineCode> / <InlineCode>mesg</InlineCode>:</strong>{" "}
          los comentarios del propio código (<InlineCode>// no me jala</InlineCode>)
          avisan que no se probaron. Necesitan dos terminales abiertas, permisos
          de escritura en el TTY destino y entradas válidas en{" "}
          <InlineCode>utmp</InlineCode>.
        </DocLi>
      </DocUl>

      {/* 6 */}
      <DocH3 id="m6">6. Robustez del parseo</DocH3>
      <DocUl>
        <DocLi>
          No soporta comillas ni rutas con espacios:{" "}
          <InlineCode>cd "mi carpeta"</InlineCode> falla. Un parser de tokens
          que respete comillas lo resuelve.
        </DocLi>
        <DocLi>
          Interfaces de red <em>hardcodeadas</em> (<InlineCode>docker0</InlineCode>,{" "}
          <InlineCode>lo</InlineCode>, <InlineCode>wlan0</InlineCode>). Mejor
          enumerarlas dinámicamente con{" "}
          <InlineCode>getifaddrs()</InlineCode> para que funcione en cualquier
          máquina.
        </DocLi>
        <DocLi>
          Validar siempre el retorno de <InlineCode>getcwd()</InlineCode> (puede
          ser <InlineCode>NULL</InlineCode>) y de{" "}
          <InlineCode>malloc()</InlineCode> en{" "}
          <InlineCode>crearvector()</InlineCode> antes de usarlos.
        </DocLi>
      </DocUl>

      {/* 7 */}
      <DocH3 id="m7">7. Calidad y mantenibilidad</DocH3>
      <DocUl>
        <DocLi>
          Compilar siempre con <InlineCode>-Wall -Wextra</InlineCode>: el
          compilador señala variables sin usar, retornos ignorados y los bugs de
          arriba antes de ejecutar.
        </DocLi>
        <DocLi>
          Descomentar <InlineCode>#include &lt;errno.h&gt;</InlineCode> y usar{" "}
          <InlineCode>perror()</InlineCode> / <InlineCode>strerror(errno)</InlineCode>{" "}
          para mensajes de error precisos en lugar de textos genéricos.
        </DocLi>
        <DocLi>
          Liberar toda la memoria reservada con{" "}
          <InlineCode>crearvector()</InlineCode> (hoy solo{" "}
          <InlineCode>find</InlineCode> hace <InlineCode>free</InlineCode>).
        </DocLi>
        <DocLi>
          Separar el código en varios archivos (<InlineCode>parser.c</InlineCode>,{" "}
          <InlineCode>comandos.c</InlineCode>, <InlineCode>main.c</InlineCode>) y
          un <InlineCode>Makefile</InlineCode> para facilitar el mantenimiento.
        </DocLi>
      </DocUl>

      <DocNote>
        Resumen de prioridades: arregla primero el{" "}
        <strong>despacho (#1)</strong> y los{" "}
        <strong>accesos fuera de límites (#2)</strong> — son los que rompen el
        programa o lo hacen impredecible. El resto mejora la calidad pero no
        impide que funcione.
      </DocNote>
    </DocPage>
  );
}