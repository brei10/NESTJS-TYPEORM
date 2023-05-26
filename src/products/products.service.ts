import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ){}

  private readonly logger = new Logger(ProductsService.name)




  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto)
      await this.productRepository.save( product );
      return product;
    } catch (error) {
      this.handleDbException(error)
  }
}

  async findAll(paginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset
    });
    if( !products ) throw new NotFoundException('Products not found');
    return products;
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if( !product ) throw new NotFoundException('Products not found');
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto
    });
    if ( !product ) throw new NotFoundException();
     try {
        await this.productRepository.save( product );
        return product;
     } catch (error) {
      this.handleDbException(error)
     }
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    this.productRepository.remove(product);
    return { success: true };
  }


  private handleDbException( error: any ){
    if(error.code === '23505'){
      new BadRequestException(error.detail)
    }
    this.logger.error(error.detail)
    throw new InternalServerErrorException('Unexpected error, check server error')
  
  }
}
