import { IHudElement, IHudElementConstructor } from "./hud-element";
import { IHud } from "./hud";
import { ITexture } from "./texture";
import { PlatformAdapter } from "@rws/platform/adapter";
import { IVec2Constructor } from "@rws/platform/graphic/vec2";
import { IGroup, IGroupConstructor } from "@rws/platform/graphic/group";

interface KerningTable {
    [combo: string]: number;
}

const LookupTable1 = [
    /*       00   01   02   03   04   05   06   07   08   09   0A   0B   0C   0D   0E   0F */
    /* 00 */ ' ', '!', '△', '#', '$', '%', '&', `'`, '(', ')', '*', '+', ',', '-', '.', '/',
    /* 10 */ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?',
    /* 20 */ '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    /* 30 */ 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_',
    /* 40 */ '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    /* 50 */ 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '°', '}', '~', ' ',
    /* 60 */ 'À', 'Á', 'Â', 'Ä', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ò', 'Ó',
    /* 70 */ 'Ô', 'Ö', 'Ù', 'Ú', 'Û', 'Ü', 'ß', 'à', 'á', 'â', 'ä', 'æ', 'ç', 'è', 'é', 'ê',
    /* 80 */ 'ë', 'ì', 'í', 'î', 'ï', 'ò', 'ó', 'ô', 'ö', 'ù', 'ú', 'û', 'ü', 'Ñ', 'ñ', '¿',
    /* 90 */ '¡', `'`
];

const LookupTable2 = [
    /*       00   01   02   03   04   05   06   07   08   09   0A   0B   0C   0D   0E   0F */
    /* 00 */ ' ', '!', '△', '#', '$', '%', '&', `'`, '(', ')', '*', '+', ',', '-', '.', '/',
    /* 10 */ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '◀', '=', '▶', '?',
    /* 20 */ '™', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    /* 30 */ 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '°',
    /* 40 */ '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    /* 50 */ 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' ', '◯', ' ', ' ', ' ',
    /* 60 */ 'À', 'Á', 'Â', 'Ä', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ò', 'Ó',
    /* 70 */ 'Ô', 'Ö', 'Ù', 'Ú', 'Û', 'Ü', 'ß', 'à', 'á', 'â', 'ä', 'æ', 'ç', 'è', 'é', 'ê',
    /* 80 */ 'ë', 'ì', 'í', 'î', 'ï', 'ò', 'ó', 'ô', 'ö', 'ù', 'ú', 'û', 'ü', 'Ñ', 'ñ', '¿',
    /* 90 */ '¡', `'`
];

const KerningTable2: KerningTable = {
    'Aa': 0, 'Ab': 0, 'Ac': 0, 'Ad': 0, 'Ae': 0, 'Af': 0, 'Ag': 0, 'Ah': 0, 'Ai': 0, 'Aj': 0, 'Ak': 0, 'Al': 0, 'Am': 0, 'An': 0, 'Ao': 0, 'Ap': 0, 'Aq': 0, 'Ar': 0, 'As': 0, 'At': 0, 'Au': 0, 'Av': 0, 'Aw': 0, 'Ax': 0, 'Ay': 0, 'Az': 0,
    'Ba': 0, 'Bb': 0, 'Bc': 0, 'Bd': 0, 'Be': 0, 'Bf': 0, 'Bg': 0, 'Bh': 0, 'Bi': 0, 'Bj': 0, 'Bk': 0, 'Bl': 0, 'Bm': 0, 'Bn': 0, 'Bo': 0, 'Bp': 0, 'Bq': 0, 'Br': 0, 'Bs': 0, 'Bt': 0, 'Bu': 0, 'Bv': 0, 'Bw': 0, 'Bx': 0, 'By': 0, 'Bz': 0,
    'Ca': 0, 'Cb': 0, 'Cc': 0, 'Cd': 0, 'Ce': 0, 'Cf': 0, 'Cg': 0, 'Ch': 0, 'Ci': 0, 'Cj': 0, 'Ck': 0, 'Cl': 0, 'Cm': 0, 'Cn': 0, 'Co': 0, 'Cp': 0, 'Cq': 0, 'Cr': 0, 'Cs': 0, 'Ct': 0, 'Cu': 0, 'Cv': 0, 'Cw': 0, 'Cx': 0, 'Cy': 0, 'Cz': 0,
    'Da': 0, 'Db': 0, 'Dc': 0, 'Dd': 0, 'De': 0, 'Df': 0, 'Dg': 0, 'Dh': 0, 'Di': 0, 'Dj': 0, 'Dk': 0, 'Dl': 0, 'Dm': 0, 'Dn': 0, 'Do': 0, 'Dp': 0, 'Dq': 0, 'Dr': 0, 'Ds': 0, 'Dt': 0, 'Du': 0, 'Dv': 0, 'Dw': 0, 'Dx': 0, 'Dy': 0, 'Dz': 0,
    'Ea': 0, 'Eb': 0, 'Ec': 0, 'Ed': 0, 'Ee': 0, 'Ef': 0, 'Eg': 0, 'Eh': 0, 'Ei': 0, 'Ej': 0, 'Ek': 0, 'El': 0, 'Em': 0, 'En': 0, 'Eo': 0, 'Ep': 0, 'Eq': 0, 'Er': 0, 'Es': 0, 'Et': 0, 'Eu': 0, 'Ev': 0, 'Ew': 0, 'Ex': 0, 'Ey': 0, 'Ez': 0,
    'Fa': 0, 'Fb': 0, 'Fc': 0, 'Fd': 0, 'Fe': 0, 'Ff': 0, 'Fg': 0, 'Fh': 0, 'Fi': 0, 'Fj': 0, 'Fk': 0, 'Fl': 0, 'Fm': 0, 'Fn': 0, 'Fo': 0, 'Fp': 0, 'Fq': 0, 'Fr': 0, 'Fs': 0, 'Ft': 0, 'Fu': 0, 'Fv': 0, 'Fw': 0, 'Fx': 0, 'Fy': 0, 'Fz': 0,
    'Ga': 0, 'Gb': 0, 'Gc': 0, 'Gd': 0, 'Ge': 0, 'Gf': 0, 'Gg': 0, 'Gh': 0, 'Gi': 0, 'Gj': 0, 'Gk': 0, 'Gl': 0, 'Gm': 0, 'Gn': 0, 'Go': 0, 'Gp': 0, 'Gq': 0, 'Gr': 0, 'Gs': 0, 'Gt': 0, 'Gu': 0, 'Gv': 0, 'Gw': 0, 'Gx': 0, 'Gy': 0, 'Gz': 0,
    'Ha': 0, 'Hb': 0, 'Hc': 0, 'Hd': 0, 'He': 0, 'Hf': 0, 'Hg': 0, 'Hh': 0, 'Hi': 0, 'Hj': 0, 'Hk': 0, 'Hl': 0, 'Hm': 0, 'Hn': 0, 'Ho': 0, 'Hp': 0, 'Hq': 0, 'Hr': 0, 'Hs': 0, 'Ht': 0, 'Hu': 0, 'Hv': 0, 'Hw': 0, 'Hx': 0, 'Hy': 0, 'Hz': 0,
    'Ia': 0, 'Ib': 0, 'Ic': 0, 'Id': 0, 'Ie': 0, 'If': 0, 'Ig': 0, 'Ih': 0, 'Ii': 0, 'Ij': 0, 'Ik': 0, 'Il': 0, 'Im': 0, 'In': 0, 'Io': 0, 'Ip': 0, 'Iq': 0, 'Ir': 0, 'Is': 0, 'It': 0, 'Iu': 0, 'Iv': 0, 'Iw': 0, 'Ix': 0, 'Iy': 0, 'Iz': 0,
    'Ja': 0, 'Jb': 0, 'Jc': 0, 'Jd': 0, 'Je': 0, 'Jf': 0, 'Jg': 0, 'Jh': 0, 'Ji': 0, 'Jj': 0, 'Jk': 0, 'Jl': 0, 'Jm': 0, 'Jn': 0, 'Jo': 0, 'Jp': 0, 'Jq': 0, 'Jr': 0, 'Js': 0, 'Jt': 0, 'Ju': 0, 'Jv': 0, 'Jw': 0, 'Jx': 0, 'Jy': 0, 'Jz': 0,
    'Ka': 0, 'Kb': 0, 'Kc': 0, 'Kd': 0, 'Ke': 0, 'Kf': 0, 'Kg': 0, 'Kh': 0, 'Ki': 0, 'Kj': 0, 'Kk': 0, 'Kl': 0, 'Km': 0, 'Kn': 0, 'Ko': 0, 'Kp': 0, 'Kq': 0, 'Kr': 0, 'Ks': 0, 'Kt': 0, 'Ku': 0, 'Kv': 0, 'Kw': 0, 'Kx': 0, 'Ky': 0, 'Kz': 0,
    'La': 0, 'Lb': 0, 'Lc': 0, 'Ld': 0, 'Le': 0, 'Lf': 0, 'Lg': 0, 'Lh': 0, 'Li': 0, 'Lj': 0, 'Lk': 0, 'Ll': 0, 'Lm': 0, 'Ln': 0, 'Lo': 0, 'Lp': 0, 'Lq': 0, 'Lr': 0, 'Ls': 0, 'Lt': 0, 'Lu': 0, 'Lv': 0, 'Lw': 0, 'Lx': 0, 'Ly': 0, 'Lz': 0,
    'Ma': 0, 'Mb': 0, 'Mc': 0, 'Md': 0, 'Me': 0, 'Mf': 0, 'Mg': 0, 'Mh': 0, 'Mi': 0, 'Mj': 0, 'Mk': 0, 'Ml': 0, 'Mm': 0, 'Mn': 0, 'Mo': 0, 'Mp': 0, 'Mq': 0, 'Mr': 0, 'Ms': 0, 'Mt': 0, 'Mu': 0, 'Mv': 0, 'Mw': 0, 'Mx': 0, 'My': 0, 'Mz': 0,
    'Na': 0, 'Nb': 0, 'Nc': 0, 'Nd': 0, 'Ne': 0, 'Nf': 0, 'Ng': 0, 'Nh': 0, 'Ni': 0, 'Nj': 0, 'Nk': 0, 'Nl': 0, 'Nm': 0, 'Nn': 0, 'No': 0, 'Np': 0, 'Nq': 0, 'Nr': 0, 'Ns': 0, 'Nt': 0, 'Nu': 0, 'Nv': 0, 'Nw': 0, 'Nx': 0, 'Ny': 0, 'Nz': 0,
    'Oa': 0, 'Ob': 0, 'Oc': 0, 'Od': 0, 'Oe': 0, 'Of': 0, 'Og': 0, 'Oh': 0, 'Oi': 0, 'Oj': 0, 'Ok': 0, 'Ol': 0, 'Om': 0, 'On': 0, 'Oo': 0, 'Op': 0, 'Oq': 0, 'Or': 0, 'Os': 0, 'Ot': 0, 'Ou': 0, 'Ov': 0, 'Ow': 0, 'Ox': 0, 'Oy': 0, 'Oz': 0,
    'Pa': 0, 'Pb': 0, 'Pc': 0, 'Pd': 0, 'Pe': 0, 'Pf': 0, 'Pg': 0, 'Ph': 0, 'Pi': 0, 'Pj': 0, 'Pk': 0, 'Pl': 0, 'Pm': 0, 'Pn': 0, 'Po': 0, 'Pp': 0, 'Pq': 0, 'Pr': 0, 'Ps': 0, 'Pt': 0, 'Pu': 0, 'Pv': 0, 'Pw': 0, 'Px': 0, 'Py': 0, 'Pz': 0,
    'Qa': 0, 'Qb': 0, 'Qc': 0, 'Qd': 0, 'Qe': 0, 'Qf': 0, 'Qg': 0, 'Qh': 0, 'Qi': 0, 'Qj': 0, 'Qk': 0, 'Ql': 0, 'Qm': 0, 'Qn': 0, 'Qo': 0, 'Qp': 0, 'Qq': 0, 'Qr': 0, 'Qs': 0, 'Qt': 0, 'Qu': 0, 'Qv': 0, 'Qw': 0, 'Qx': 0, 'Qy': 0, 'Qz': 0,
    'Ra': 0, 'Rb': 0, 'Rc': 0, 'Rd': 0, 'Re': 0, 'Rf': 0, 'Rg': 0, 'Rh': 0, 'Ri': 0, 'Rj': 0, 'Rk': 0, 'Rl': 0, 'Rm': 0, 'Rn': 0, 'Ro': 0, 'Rp': 0, 'Rq': 0, 'Rr': 0, 'Rs': 0, 'Rt': 0, 'Ru': 0, 'Rv': 0, 'Rw': 0, 'Rx': 0, 'Ry': 0, 'Rz': 0,
    'Sa': 0, 'Sb': 0, 'Sc': 0, 'Sd': 0, 'Se': 0, 'Sf': 0, 'Sg': 0, 'Sh': 0, 'Si': 0, 'Sj': 0, 'Sk': 0, 'Sl': 0, 'Sm': 0, 'Sn': 0, 'So': 0, 'Sp': 0, 'Sq': 0, 'Sr': 0, 'Ss': 0, 'St': 0, 'Su': 0, 'Sv': 0, 'Sw': 0, 'Sx': 0, 'Sy': 0, 'Sz': 0,
    'Ta': 0, 'Tb': 0, 'Tc': 0, 'Td': 0, 'Te': 0, 'Tf': 0, 'Tg': 0, 'Th': 0, 'Ti': 0, 'Tj': 0, 'Tk': 0, 'Tl': 0, 'Tm': 0, 'Tn': 0, 'To': 0, 'Tp': 0, 'Tq': 0, 'Tr': 0, 'Ts': 0, 'Tt': 0, 'Tu': 0, 'Tv': 0, 'Tw': 0, 'Tx': 0, 'Ty': 0, 'Tz': 0,
    'Ua': 0, 'Ub': 0, 'Uc': 0, 'Ud': 0, 'Ue': 0, 'Uf': 0, 'Ug': 0, 'Uh': 0, 'Ui': 0, 'Uj': 0, 'Uk': 0, 'Ul': 0, 'Um': 0, 'Un': 0, 'Uo': 0, 'Up': 0, 'Uq': 0, 'Ur': 0, 'Us': 0, 'Ut': 0, 'Uu': 0, 'Uv': 0, 'Uw': 0, 'Ux': 0, 'Uy': 0, 'Uz': 0,
    'Va': 0, 'Vb': 0, 'Vc': 0, 'Vd': 0, 'Ve': 0, 'Vf': 0, 'Vg': 0, 'Vh': 0, 'Vi': 0, 'Vj': 0, 'Vk': 0, 'Vl': 0, 'Vm': 0, 'Vn': 0, 'Vo': 0, 'Vp': 0, 'Vq': 0, 'Vr': 0, 'Vs': 0, 'Vt': 0, 'Vu': 0, 'Vv': 0, 'Vw': 0, 'Vx': 0, 'Vy': 0, 'Vz': 0,
    'Wa': 0, 'Wb': 0, 'Wc': 0, 'Wd': 0, 'We': 0, 'Wf': 0, 'Wg': 0, 'Wh': 0, 'Wi': 0, 'Wj': 0, 'Wk': 0, 'Wl': 0, 'Wm': 0, 'Wn': 0, 'Wo': 0, 'Wp': 0, 'Wq': 0, 'Wr': 0, 'Ws': 0, 'Wt': 0, 'Wu': 0, 'Wv': 0, 'Ww': 0, 'Wx': 0, 'Wy': 0, 'Wz': 0,
    'Xa': 0, 'Xb': 0, 'Xc': 0, 'Xd': 0, 'Xe': 0, 'Xf': 0, 'Xg': 0, 'Xh': 0, 'Xi': 0, 'Xj': 0, 'Xk': 0, 'Xl': 0, 'Xm': 0, 'Xn': 0, 'Xo': 0, 'Xp': 0, 'Xq': 0, 'Xr': 0, 'Xs': 0, 'Xt': 0, 'Xu': 0, 'Xv': 0, 'Xw': 0, 'Xx': 0, 'Xy': 0, 'Xz': 0,
    'Ya': 0, 'Yb': 0, 'Yc': 0, 'Yd': 0, 'Ye': 0, 'Yf': 0, 'Yg': 0, 'Yh': 0, 'Yi': 0, 'Yj': 0, 'Yk': 0, 'Yl': 0, 'Ym': 0, 'Yn': 0, 'Yo': 0, 'Yp': 0, 'Yq': 0, 'Yr': 0, 'Ys': 0, 'Yt': 0, 'Yu': 0, 'Yv': 0, 'Yw': 0, 'Yx': 0, 'Yy': 0, 'Yz': 0,
    'Za': 0, 'Zb': 0, 'Zc': 0, 'Zd': 0, 'Ze': 0, 'Zf': 0, 'Zg': 0, 'Zh': 0, 'Zi': 0, 'Zj': 0, 'Zk': 0, 'Zl': 0, 'Zm': 0, 'Zn': 0, 'Zo': 0, 'Zp': 0, 'Zq': 0, 'Zr': 0, 'Zs': 0, 'Zt': 0, 'Zu': 0, 'Zv': 0, 'Zw': 0, 'Zx': 0, 'Zy': 0, 'Zz': 0,
    'aa': 0, 'ab': 0, 'ac': 0, 'ad': 0, 'ae': 0, 'af': 0, 'ag': 0, 'ah': 0, 'ai': 0, 'aj': 0, 'ak': 0, 'al': 0, 'am': 0, 'an': 0, 'ao': 0, 'ap': 0, 'aq': 0, 'ar': 0, 'as': 0, 'at': 0, 'au': 0, 'av': 0, 'aw': 0, 'ax': 0, 'ay': 0, 'az': 0,
    'ba': 0, 'bb': 0, 'bc': 0, 'bd': 0, 'be': 0, 'bf': 0, 'bg': 0, 'bh': 0, 'bi': 0, 'bj': 0, 'bk': 0, 'bl': 0, 'bm': 0, 'bn': 0, 'bo': 0, 'bp': 0, 'bq': 0, 'br': 0, 'bs': 0, 'bt': 0, 'bu': 0, 'bv': 0, 'bw': 0, 'bx': 0, 'by': 0, 'bz': 0,
    'ca': 0, 'cb': 0, 'cc': 0, 'cd': 0, 'ce': 0, 'cf': 0, 'cg': 0, 'ch': 0, 'ci': 0, 'cj': 0, 'ck': 0, 'cl': 0, 'cm': 0, 'cn': 0, 'co': 0, 'cp': 0, 'cq': 0, 'cr': 0, 'cs': 0, 'ct': 0, 'cu': 0, 'cv': 0, 'cw': 0, 'cx': 0, 'cy': 0, 'cz': 0,
    'da': 0, 'db': 0, 'dc': 0, 'dd': 0, 'de': 0, 'df': 0, 'dg': 0, 'dh': 0, 'di': 0, 'dj': 0, 'dk': 0, 'dl': 0, 'dm': 0, 'dn': 0, 'do': 0, 'dp': 0, 'dq': 0, 'dr': 0, 'ds': 0, 'dt': 0, 'du': 0, 'dv': 0, 'dw': 0, 'dx': 0, 'dy': 0, 'dz': 0,
    'ea': 0, 'eb': 0, 'ec': 0, 'ed': 0, 'ee': 0, 'ef': 0, 'eg': 0, 'eh': 0, 'ei': 0, 'ej': 0, 'ek': 0, 'el': 0, 'em': 0, 'en': 0, 'eo': 0, 'ep': 0, 'eq': 0, 'er': 0, 'es': 0, 'et': 0, 'eu': 0, 'ev': 0, 'ew': 0, 'ex': 0, 'ey': 0, 'ez': 0,
    'fa': 0, 'fb': 0, 'fc': 0, 'fd': 0, 'fe': 0, 'ff': 0, 'fg': 0, 'fh': 0, 'fi': 0, 'fj': 0, 'fk': 0, 'fl': 0, 'fm': 0, 'fn': 0, 'fo': 0, 'fp': 0, 'fq': 0, 'fr': 0, 'fs': 0, 'ft': 0, 'fu': 0, 'fv': 0, 'fw': 0, 'fx': 0, 'fy': 0, 'fz': 0,
    'ga': 0, 'gb': 0, 'gc': 0, 'gd': 0, 'ge': 0, 'gf': 0, 'gg': 0, 'gh': 0, 'gi': 0, 'gj': 0, 'gk': 0, 'gl': 0, 'gm': 0, 'gn': 0, 'go': 0, 'gp': 0, 'gq': 0, 'gr': 0, 'gs': 0, 'gt': 0, 'gu': 0, 'gv': 0, 'gw': 0, 'gx': 0, 'gy': 0, 'gz': 0,
    'ha': 0, 'hb': 0, 'hc': 0, 'hd': 0, 'he': 0, 'hf': 0, 'hg': 0, 'hh': 0, 'hi': 0, 'hj': 0, 'hk': 0, 'hl': 0, 'hm': 0, 'hn': 0, 'ho': 0, 'hp': 0, 'hq': 0, 'hr': 0, 'hs': 0, 'ht': 0, 'hu': 0, 'hv': 0, 'hw': 0, 'hx': 0, 'hy': 0, 'hz': 0,
    'ia': 0, 'ib': 0, 'ic': 0, 'id': 0, 'ie': 0, 'if': 0, 'ig': 0, 'ih': 0, 'ii': 0, 'ij': 0, 'ik': 0, 'il': 0, 'im': 0, 'in': 0, 'io': 0, 'ip': 0, 'iq': 0, 'ir': 0, 'is': 0, 'it': 0, 'iu': 0, 'iv': 0, 'iw': 0, 'ix': 0, 'iy': 0, 'iz': 0,
    'ja': 0, 'jb': 0, 'jc': 0, 'jd': 0, 'je': 0, 'jf': 0, 'jg': 0, 'jh': 0, 'ji': 0, 'jj': 0, 'jk': 0, 'jl': 0, 'jm': 0, 'jn': 0, 'jo': 0, 'jp': 0, 'jq': 0, 'jr': 0, 'js': 0, 'jt': 0, 'ju': 0, 'jv': 0, 'jw': 0, 'jx': 0, 'jy': 0, 'jz': 0,
    'ka': 0, 'kb': 0, 'kc': 0, 'kd': 0, 'ke': 0, 'kf': 0, 'kg': 0, 'kh': 0, 'ki': 0, 'kj': 0, 'kk': 0, 'kl': 0, 'km': 0, 'kn': 0, 'ko': 0, 'kp': 0, 'kq': 0, 'kr': 0, 'ks': 0, 'kt': 0, 'ku': 0, 'kv': 0, 'kw': 0, 'kx': 0, 'ky': 0, 'kz': 0,
    'la': 0, 'lb': 0, 'lc': 0, 'ld': 0, 'le': 0, 'lf': 0, 'lg': 0, 'lh': 0, 'li': 0, 'lj': 0, 'lk': 0, 'll': 0, 'lm': 0, 'ln': 0, 'lo': 0, 'lp': 0, 'lq': 0, 'lr': 0, 'ls': 0, 'lt': 0, 'lu': 0, 'lv': 0, 'lw': 0, 'lx': 0, 'ly': 0, 'lz': 0,
    'ma': 0, 'mb': 0, 'mc': 0, 'md': 0, 'me': 0, 'mf': 0, 'mg': 0, 'mh': 0, 'mi': 0, 'mj': 0, 'mk': 0, 'ml': 0, 'mm': 0, 'mn': 0, 'mo': 0, 'mp': 0, 'mq': 0, 'mr': 0, 'ms': 0, 'mt': 0, 'mu': 0, 'mv': 0, 'mw': 0, 'mx': 0, 'my': 0, 'mz': 0,
    'na': 0, 'nb': 0, 'nc': 0, 'nd': 0, 'ne': 0, 'nf': 0, 'ng': 0, 'nh': 0, 'ni': 0, 'nj': 0, 'nk': 0, 'nl': 0, 'nm': 0, 'nn': 0, 'no': 0, 'np': 0, 'nq': 0, 'nr': 0, 'ns': 0, 'nt': 0, 'nu': 0, 'nv': 0, 'nw': 0, 'nx': 0, 'ny': 0, 'nz': 0,
    'oa': 0, 'ob': 0, 'oc': 0, 'od': 0, 'oe': 0, 'of': 0, 'og': 0, 'oh': 0, 'oi': 0, 'oj': 0, 'ok': 0, 'ol': 0, 'om': 0, 'on': 0, 'oo': 0, 'op': 0, 'oq': 0, 'or': 0, 'os': 0, 'ot': 0, 'ou': 0, 'ov': 0, 'ow': 0, 'ox': 0, 'oy': 0, 'oz': 0,
    'pa': 0, 'pb': 0, 'pc': 0, 'pd': 0, 'pe': 0, 'pf': 0, 'pg': 0, 'ph': 0, 'pi': 0, 'pj': 0, 'pk': 0, 'pl': 0, 'pm': 0, 'pn': 0, 'po': 0, 'pp': 0, 'pq': 0, 'pr': 0, 'ps': 0, 'pt': 0, 'pu': 0, 'pv': 0, 'pw': 0, 'px': 0, 'py': 0, 'pz': 0,
    'qa': 0, 'qb': 0, 'qc': 0, 'qd': 0, 'qe': 0, 'qf': 0, 'qg': 0, 'qh': 0, 'qi': 0, 'qj': 0, 'qk': 0, 'ql': 0, 'qm': 0, 'qn': 0, 'qo': 0, 'qp': 0, 'qq': 0, 'qr': 0, 'qs': 0, 'qt': 0, 'qu': 0, 'qv': 0, 'qw': 0, 'qx': 0, 'qy': 0, 'qz': 0,
    'ra': 0, 'rb': 0, 'rc': 0, 'rd': 0, 're': 0, 'rf': 0, 'rg': 0, 'rh': 0, 'ri': 0, 'rj': 0, 'rk': 0, 'rl': 0, 'rm': 0, 'rn': 0, 'ro': 0, 'rp': 0, 'rq': 0, 'rr': 0, 'rs': 0, 'rt': 0, 'ru': 0, 'rv': 0, 'rw': 0, 'rx': 0, 'ry': 0, 'rz': 0,
    'sa': 0, 'sb': 0, 'sc': 0, 'sd': 0, 'se': 0, 'sf': 0, 'sg': 0, 'sh': 0, 'si': 0, 'sj': 0, 'sk': 0, 'sl': 0, 'sm': 0, 'sn': 0, 'so': 0, 'sp': 0, 'sq': 0, 'sr': 0, 'ss': 0, 'st': 0, 'su': 0, 'sv': 0, 'sw': 0, 'sx': 0, 'sy': 0, 'sz': 0,
    'ta': 0, 'tb': 0, 'tc': 0, 'td': 0, 'te': 0, 'tf': 0, 'tg': 0, 'th': 0, 'ti': 0, 'tj': 0, 'tk': 0, 'tl': 0, 'tm': 0, 'tn': 0, 'to': 0, 'tp': 0, 'tq': 0, 'tr': 0, 'ts': 0, 'tt': 0, 'tu': 0, 'tv': 0, 'tw': 0, 'tx': 0, 'ty': 0, 'tz': 0,
    'ua': 0, 'ub': 0, 'uc': 0, 'ud': 0, 'ue': 0, 'uf': 0, 'ug': 0, 'uh': 0, 'ui': 0, 'uj': 0, 'uk': 0, 'ul': 0, 'um': 0, 'un': 0, 'uo': 0, 'up': 0, 'uq': 0, 'ur': 0, 'us': 0, 'ut': 0, 'uu': 0, 'uv': 0, 'uw': 0, 'ux': 0, 'uy': 0, 'uz': 0,
    'va': 0, 'vb': 0, 'vc': 0, 'vd': 0, 've': 0, 'vf': 0, 'vg': 0, 'vh': 0, 'vi': 0, 'vj': 0, 'vk': 0, 'vl': 0, 'vm': 0, 'vn': 0, 'vo': 0, 'vp': 0, 'vq': 0, 'vr': 0, 'vs': 0, 'vt': 0, 'vu': 0, 'vv': 0, 'vw': 0, 'vx': 0, 'vy': 0, 'vz': 0,
    'wa': 0, 'wb': 0, 'wc': 0, 'wd': 0, 'we': 0, 'wf': 0, 'wg': 0, 'wh': 0, 'wi': 0, 'wj': 0, 'wk': 0, 'wl': 0, 'wm': 0, 'wn': 0, 'wo': 0, 'wp': 0, 'wq': 0, 'wr': 0, 'ws': 0, 'wt': 0, 'wu': 0, 'wv': 0, 'ww': 0, 'wx': 0, 'wy': 0, 'wz': 0,
    'xa': 0, 'xb': 0, 'xc': 0, 'xd': 0, 'xe': 0, 'xf': 0, 'xg': 0, 'xh': 0, 'xi': 0, 'xj': 0, 'xk': 0, 'xl': 0, 'xm': 0, 'xn': 0, 'xo': 0, 'xp': 0, 'xq': 0, 'xr': 0, 'xs': 0, 'xt': 0, 'xu': 0, 'xv': 0, 'xw': 0, 'xx': 0, 'xy': 0, 'xz': 0,
    'ya': 0, 'yb': 0, 'yc': 0, 'yd': 0, 'ye': 0, 'yf': 0, 'yg': 0, 'yh': 0, 'yi': 0, 'yj': 0, 'yk': 0, 'yl': 0, 'ym': 0, 'yn': 0, 'yo': 0, 'yp': 0, 'yq': 0, 'yr': 0, 'ys': 0, 'yt': 0, 'yu': 0, 'yv': 0, 'yw': 0, 'yx': 0, 'yy': 0, 'yz': 0,
    'za': 0, 'zb': 0, 'zc': 0, 'zd': 0, 'ze': 0, 'zf': 0, 'zg': 0, 'zh': 0, 'zi': 0, 'zj': 0, 'zk': 0, 'zl': 0, 'zm': 0, 'zn': 0, 'zo': 0, 'zp': 0, 'zq': 0, 'zr': 0, 'zs': 0, 'zt': 0, 'zu': 0, 'zv': 0, 'zw': 0, 'zx': 0, 'zy': 0, 'zz': 0,
};

const TransliterationTable = {
    'À': 'A', 'Á': 'A', 'Â': 'A', 'Ä': 'A', 'Æ': 'A',
    'Ç': 'C', 'ç': 'c',
    'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
    'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Ö': 'O',
    'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
    'ß': 's',
    'à': 'a', 'á': 'a', 'â': 'a', 'ä': 'a', 'æ': 'a',
    'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
    'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
    'ò': 'o', 'ó': 'o', 'ô': 'o', 'ö': 'o',
    'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
    'Ñ': 'N', 'ñ': 'n',
    '¿': '?', '¡': '!'
}

const FontWidthTable1 = [
    64/*0*/, 26/*0*/, 49/*0*/, 41/*0*/, 47/*1*/, 61/*1*/, 50/*1*/, 20/*1*/, 31/*1*/, 31/*1*/, 25/*1*/, 44/*3*/, 26/*2*/, 25/*1*/, 21/*1*/, 32/*0*/,
    43/*0*/, 35/*1*/, 43/*0*/, 43/*0*/, 46/*0*/, 45/*1*/, 42/*0*/, 42/*0*/, 42/*0*/, 42/*0*/, 25/*1*/, 26/*0*/, 36/*0*/,
]

const transliterate = (char: string): string => {
    const transliterated = TransliterationTable[char];
    if(transliterated){
        return transliterated;
    }
    return char;
}

const ATLAS_COLS = 16;
const ATLAS_ROWS = 13;

export class HudText {
    hud: IHud;
    text: string;
    group: IGroup;
    texture: ITexture;
    platform: PlatformAdapter;
    fontSizeWidth: number;
    fontSizeHeight: number;
    LookupTable: string[];
    KerningTable: KerningTable;

    HudElement: IHudElementConstructor;
    Group: IGroupConstructor;
    Vec2: IVec2Constructor;

    constructor(platform: PlatformAdapter, hud: IHud, text: string, fontHeight: number){
        Object.assign(this, platform.graphicConstructors);
        this.platform = platform;
        this.texture = this.platform.rwsStructPool.texturePool.get('font2');
        this.LookupTable = LookupTable2;
        this.KerningTable = KerningTable2;
        this.group = new this.Group();
        this.hud = hud;
        this.hud.add(this.group);
        this.text = text;
        this.fontSizeHeight = fontHeight;
        this.fontSizeWidth = fontHeight * ATLAS_ROWS / ATLAS_COLS;
        this.typeset();
    }

    typeset(): void {
        this.group.removeAllChildren();
        this.group.addChild(...this.text.split('\n').map((line, y) => line.split('').map((char, x) => {
            const el = this.createLetter(char);
            el.setPosition(x * this.fontSizeWidth, y * -this.fontSizeHeight);
            el.name = `char__${char}`;
            return el;
        })).flat());
    }

    typesetLine(line: string, y: number): void {
        line.split('').forEach((char, x) => {
            this.typesetChar(char, x, y, line[x - 1]);
        });
    }

    typesetChar(char: string, x: number, y: number, lastChar?: string): void {
        const el = this.createLetter(char);
        el.setPosition(x * this.fontSizeWidth, y * -this.fontSizeHeight);
        el.name = `char__${char}`;
        this.group.addChild(el);
    }

    createLetter(char: string): IHudElement {
        const [charCol, charRow] = this.getCharAtlasPosition(char);
        const el = new this.HudElement(this.texture);

        el.setSize(this.fontSizeWidth, this.fontSizeHeight);
        el.setTextureSize(1 / ATLAS_COLS, 1 / ATLAS_ROWS);
        el.setTextureOffset(this.texture.width / ATLAS_COLS * charCol, this.texture.height / ATLAS_ROWS * charRow);
        return el;
    }

    getCharAtlasPosition(char: string): [number, number] {
        let charIndex = this.LookupTable.indexOf(char);
        if(charIndex === -1){
            charIndex = 0x1F; // = ?
        }

        return [
            charIndex % ATLAS_COLS,
            Math.floor(charIndex / ATLAS_COLS)
        ];
    }
}
